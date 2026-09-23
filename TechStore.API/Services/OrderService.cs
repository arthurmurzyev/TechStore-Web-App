using Microsoft.EntityFrameworkCore;
using TechStore.API.Data;
using TechStore.API.DTOs;
using TechStore.API.Models;

namespace TechStore.API.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderDto>> GetOrdersByUserIdAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int userId, int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        return order != null ? MapToDto(order) : null;
    }

    public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.CartItems.Any())
            throw new InvalidOperationException("Cart is empty");

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            foreach (var cartItem in cart.CartItems)
            {
                if (cartItem.Product.StockQuantity < cartItem.Quantity)
                    throw new InvalidOperationException($"Insufficient stock for {cartItem.Product.Name}");
            }

            var order = new Order
            {
                UserId = userId,
                OrderStatus = "Pending",
                ShippingAddress = dto.ShippingAddress,
                CreatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            decimal totalAmount = 0;

            foreach (var cartItem in cart.CartItems)
            {
                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    PriceAtPurchase = cartItem.Product.Price
                };
                order.OrderItems.Add(orderItem);
                totalAmount += orderItem.PriceAtPurchase * orderItem.Quantity;

                cartItem.Product.StockQuantity -= cartItem.Quantity;
            }

            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);
            cart.CartItems.Clear();

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            await _context.Entry(order)
                .Collection(o => o.OrderItems)
                .Query()
                .Include(oi => oi.Product)
                .LoadAsync();

            return MapToDto(order);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string newStatus)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return null;

        order.OrderStatus = newStatus;
        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    private OrderDto MapToDto(Order order)
    {
        var items = order.OrderItems.Select(oi => new OrderItemDto
        {
            Id = oi.Id,
            ProductId = oi.ProductId,
            ProductName = oi.Product?.Name ?? string.Empty,
            ProductImageUrl = oi.Product?.ImageUrl ?? string.Empty,
            Quantity = oi.Quantity,
            PriceAtOrder = oi.PriceAtPurchase,
            Subtotal = oi.PriceAtPurchase * oi.Quantity
        }).ToList();

        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderStatus = order.OrderStatus,
            TotalAmount = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            CreatedAt = order.CreatedAt,
            OrderItems = items
        };
    }
}
