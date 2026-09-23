using Microsoft.EntityFrameworkCore;
using TechStore.API.Data;
using TechStore.API.DTOs;

namespace TechStore.API.Services;

public class PaymentService : IPaymentService
{
    private readonly AppDbContext _context;
    private readonly IOrderService _orderService;

    public PaymentService(AppDbContext context, IOrderService orderService)
    {
        _context = context;
        _orderService = orderService;
    }

    public async Task<PaymentResultDto> ProcessPaymentAsync(ProcessPaymentDto dto)
    {
        var order = await _context.Orders.FindAsync(dto.OrderId);
        
        if (order == null)
        {
            return new PaymentResultDto
            {
                Success = false,
                Message = "Order not found"
            };
        }

        if (order.OrderStatus != "Pending")
        {
            return new PaymentResultDto
            {
                Success = false,
                Message = $"Order is already {order.OrderStatus}"
            };
        }

        await Task.Delay(1000);

        var random = new Random();
        var paymentSuccess = random.Next(100) < 95;

        if (paymentSuccess)
        {
            await _orderService.UpdateOrderStatusAsync(dto.OrderId, "Paid");
            
            return new PaymentResultDto
            {
                Success = true,
                Message = "Payment processed successfully",
                TransactionId = Guid.NewGuid().ToString(),
                OrderId = dto.OrderId
            };
        }
        else
        {
            await _orderService.UpdateOrderStatusAsync(dto.OrderId, "Cancelled");
            
            return new PaymentResultDto
            {
                Success = false,
                Message = "Payment declined by payment provider"
            };
        }
    }
}
