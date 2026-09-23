using TechStore.API.DTOs;

namespace TechStore.API.Services;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(int page, int pageSize, string? searchTerm, int? categoryId, decimal? minPrice, decimal? maxPrice);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteProductAsync(int id);
}
