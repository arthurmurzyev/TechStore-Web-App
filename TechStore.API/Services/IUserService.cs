namespace TechStore.API.Services;

public interface IUserService
{
    Task UpdateEmailAsync(int userId, string email);
    Task ChangePasswordAsync(int userId, string currentPassword, string newPassword);
}
