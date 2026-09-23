namespace TechStore.API.DTOs;

public class PaymentResultDto
{
    public bool Success { get; set; }
    public int OrderId { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
