using Microsoft.EntityFrameworkCore;
using TechStore.API.Data;

namespace TechStore.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task UpdateEmailAsync(int userId, string email)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.Id != userId);

        if (existingUser != null)
            throw new InvalidOperationException("Email already in use");

        user.Email = email;
        await _context.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            throw new InvalidOperationException("Current password is incorrect");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();
    }
}
