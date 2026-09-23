namespace TechStore.API.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string OrderStatus { get; set; } = "Pending";
    public decimal TotalAmount { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual User? User { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
