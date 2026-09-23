using TechStore.API.DTOs;

namespace TechStore.API.Services;

public interface ICartService
{
    Task<CartDto?> GetCartByUserIdAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto);
    Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto dto);
    Task<bool> RemoveCartItemAsync(int userId, int cartItemId);
    Task<bool> ClearCartAsync(int userId);
}
