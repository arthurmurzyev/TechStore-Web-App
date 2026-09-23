using Microsoft.EntityFrameworkCore;
using TechStore.API.Data;
using TechStore.API.DTOs;
using TechStore.API.Models;

namespace TechStore.API.Services;

public class CartService : ICartService
{
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto?> GetCartByUserIdAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return null;

        return MapToDto(cart);
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
            throw new InvalidOperationException("Product not found");

        if (product.StockQuantity < dto.Quantity)
            throw new InvalidOperationException("Insufficient stock");

        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                CartItems = new List<CartItem>()
            };
            _context.Carts.Add(cart);
        }

        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };
            cart.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();

        await _context.Entry(cart)
            .Collection(c => c.CartItems)
            .Query()
            .Include(ci => ci.Product)
            .LoadAsync();

        return MapToDto(cart);
    }

    public async Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto dto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return null;

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (cartItem == null)
            return null;

        if (dto.Quantity <= 0)
        {
            cart.CartItems.Remove(cartItem);
        }
        else
        {
            var product = await _context.Products.FindAsync(cartItem.ProductId);
            if (product != null && product.StockQuantity < dto.Quantity)
                throw new InvalidOperationException("Insufficient stock");

            cartItem.Quantity = dto.Quantity;
        }

        await _context.SaveChangesAsync();

        return MapToDto(cart);
    }

    public async Task<bool> RemoveCartItemAsync(int userId, int cartItemId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return false;

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (cartItem == null)
            return false;

        cart.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return false;

        cart.CartItems.Clear();
        await _context.SaveChangesAsync();
        return true;
    }

    private CartDto MapToDto(Cart cart)
    {
        var items = cart.CartItems.Select(ci => new CartItemDto
        {
            Id = ci.Id,
            ProductId = ci.ProductId,
            ProductName = ci.Product?.Name ?? string.Empty,
            ProductPrice = ci.Product?.Price ?? 0,
            ProductImageUrl = ci.Product?.ImageUrl ?? string.Empty,
            ProductDescription = ci.Product?.Description ?? string.Empty,
            ProductStockQuantity = ci.Product?.StockQuantity ?? 0,
            Quantity = ci.Quantity,
            Subtotal = (ci.Product?.Price ?? 0) * ci.Quantity
        }).ToList();

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = items,
            TotalAmount = items.Sum(i => i.Subtotal)
        };
    }
}
