namespace TechStore.API.DTOs;

public class AddToCartDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}
