using TechStore.API.DTOs;

namespace TechStore.API.Services;

public interface IPaymentService
{
    Task<PaymentResultDto> ProcessPaymentAsync(ProcessPaymentDto dto);
}
