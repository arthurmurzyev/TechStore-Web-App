using TechStore.API.DTOs;

namespace TechStore.API.Services;

public interface IOrderService
{
    Task<List<OrderDto>> GetOrdersByUserIdAsync(int userId);
    Task<OrderDto?> GetOrderByIdAsync(int userId, int orderId);
    Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto);
    Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string newStatus);
}
