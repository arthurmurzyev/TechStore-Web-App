using TechStore.API.DTOs;
using TechStore.API.Models;

namespace TechStore.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    string GenerateJwtToken(User user);
}
