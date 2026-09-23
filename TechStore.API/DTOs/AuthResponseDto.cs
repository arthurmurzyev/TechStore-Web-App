namespace TechStore.API.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserInfoDto User { get; set; } = new();
}

public class UserInfoDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
