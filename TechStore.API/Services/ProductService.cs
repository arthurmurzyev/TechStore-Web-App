using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TechStore.API.Data;
using TechStore.API.DTOs;
using TechStore.API.Models;

namespace TechStore.API.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ProductDto>> GetProductsAsync(int page, int pageSize, string? searchTerm, int? categoryId, decimal? minPrice, decimal? maxPrice)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .AsQueryable();

        // Ищем только по названию товара (Name), исключая Description
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p => p.Name.Contains(searchTerm));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        var totalCount = await query.CountAsync();
        var products = await query
             .Skip((page - 1) * pageSize)
             .Take(pageSize)
             .ToListAsync();

        var items = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : "",
            ImageUrl = p.ImageUrl,
            ImageUrl2 = p.ImageUrl2,
            ImageUrl3 = p.ImageUrl3,
            ImageUrl4 = p.ImageUrl4,
            Specifications = !string.IsNullOrEmpty(p.Specifications)
                ? JsonSerializer.Deserialize<Dictionary<string, string>>(p.Specifications) ?? new Dictionary<string, string>()
                : new Dictionary<string, string>(),
            CreatedAt = p.CreatedAt
        }).ToList();

        return new PagedResult<ProductDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        return product != null ? MapToDto(product) : null;
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            CategoryId = dto.CategoryId,
            ImageUrl = dto.ImageUrl,
            Specifications = dto.Specifications != null ? JsonSerializer.Serialize(dto.Specifications) : null,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        await _context.Entry(product).Reference(p => p.Category).LoadAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return null;

        if (dto.Name != null)
            product.Name = dto.Name;

        if (dto.Description != null)
            product.Description = dto.Description;

        if (dto.Price.HasValue)
            product.Price = dto.Price.Value;

        if (dto.StockQuantity.HasValue)
            product.StockQuantity = dto.StockQuantity.Value;

        if (dto.CategoryId.HasValue)
            product.CategoryId = dto.CategoryId.Value;

        if (dto.ImageUrl != null)
            product.ImageUrl = dto.ImageUrl;

        if (dto.Specifications != null)
            product.Specifications = JsonSerializer.Serialize(dto.Specifications);

        await _context.SaveChangesAsync();
        await _context.Entry(product).Reference(p => p.Category).LoadAsync();

        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    private ProductDto MapToDto(Product product)
    {
        Dictionary<string, string> specs;
        try
        {
            specs = !string.IsNullOrEmpty(product.Specifications)
                ? JsonSerializer.Deserialize<Dictionary<string, string>>(product.Specifications) ?? new Dictionary<string, string>()
                : new Dictionary<string, string>();
        }
        catch
        {
            specs = new Dictionary<string, string>();
        }

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            ImageUrl = product.ImageUrl,
            ImageUrl2 = product.ImageUrl2,
            ImageUrl3 = product.ImageUrl3,
            ImageUrl4 = product.ImageUrl4,
            Specifications = specs,
            CreatedAt = product.CreatedAt
        };
    }
}