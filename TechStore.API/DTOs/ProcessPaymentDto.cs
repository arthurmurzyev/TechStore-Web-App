namespace TechStore.API.DTOs;

public class ProcessPaymentDto
{
    public int OrderId { get; set; }
    public string PaymentMethod { get; set; } = "CreditCard";
}
