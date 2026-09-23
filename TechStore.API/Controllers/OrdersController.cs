using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechStore.API.DTOs;
using TechStore.API.Services;

namespace TechStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return 0;
        }
        return userId;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetCurrentUserId();
        if (userId == 0)
            return Unauthorized(new { message = "User not authenticated" });

        var orders = await _orderService.GetOrdersByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetCurrentUserId();
        if (userId == 0)
            return Unauthorized(new { message = "User not authenticated" });

        var orders = await _orderService.GetOrdersByUserIdAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == 0)
            return Unauthorized(new { message = "User not authenticated" });

        var order = await _orderService.GetOrderByIdAsync(userId, id);

        if (order == null)
            return NotFound(new { message = "Order not found" });

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized(new { message = "User not authenticated" });

            var order = await _orderService.CreateOrderAsync(userId, dto);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var order = await _orderService.UpdateOrderStatusAsync(id, dto.Status);
        
        if (order == null)
            return NotFound(new { message = "Order not found" });

        return Ok(order);
    }
}
