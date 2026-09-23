namespace TechStore.API.Models;

public class Cart
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual User? User { get; set; }
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
