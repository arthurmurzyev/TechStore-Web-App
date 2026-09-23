namespace TechStore.API.DTOs;

public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
}

public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal ProductPrice { get; set; }
    public string ProductImageUrl { get; set; } = string.Empty;
    public string ProductDescription { get; set; } = string.Empty;
    public int ProductStockQuantity { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}
