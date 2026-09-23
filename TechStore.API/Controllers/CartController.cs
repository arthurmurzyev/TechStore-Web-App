using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechStore.API.DTOs;
using TechStore.API.Services;

namespace TechStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetCurrentUserId();
        var cart = await _cartService.GetCartByUserIdAsync(userId);
        
        if (cart == null)
            return Ok(new { items = new List<object>(), totalAmount = 0 });

        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var cart = await _cartService.AddToCartAsync(userId, dto);
            return Ok(cart);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var cart = await _cartService.UpdateCartItemAsync(userId, cartItemId, dto);
            
            if (cart == null)
                return NotFound(new { message = "Cart item not found" });

            return Ok(cart);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.RemoveCartItemAsync(userId, cartItemId);
        
        if (!result)
            return NotFound(new { message = "Cart item not found" });

        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetCurrentUserId();
        var result = await _cartService.ClearCartAsync(userId);
        
        if (!result)
            return NotFound(new { message = "Cart not found" });

        return NoContent();
    }
}
