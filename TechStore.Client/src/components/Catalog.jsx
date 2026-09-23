import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService, cartService, authService } from '../services/api';
import { Search, ShoppingCart } from 'lucide-react';

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleLiveSearch();
      } else {
        loadProducts(selectedCategory);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async (categoryId = null) => {
    setLoading(true);
    try {
      const params = {};
      if (categoryId) params.categoryId = categoryId;
      const data = await productService.getAll(params);
      setProducts(data?.items || data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    loadProducts(categoryId);
  };

  const handleLiveSearch = async () => {
    try {
      const params = selectedCategory ? { categoryId: selectedCategory } : {};
      const data = await productService.search(searchTerm, params);
      setProducts(data?.items || data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadProducts(selectedCategory);
      return;
    }
    handleLiveSearch();
  };

  const handleAddToCart = async (productId) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await cartService.addItem(productId, 1);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-50 mb-2">Каталог электроники</h1>
        <p className="text-slate-400">Найдите лучшие технологии для вашего дома и работы</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск товаров..."
              className="w-full pl-10 pr-4 py-2.5 bg-primary-light border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-accent-cool text-primary font-medium rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-accent-cool text-primary'
              : 'bg-primary-light text-slate-300 border border-slate-700 hover:border-accent-cool'
          }`}
        >
          Все категории
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-accent-cool text-primary'
                : 'bg-primary-light text-slate-300 border border-slate-700 hover:border-accent-cool'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-accent-cool border-t-transparent rounded-full animate-spin"></div>
        </div>
        ) : (Array.isArray(products) ? products : []).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Товары не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(Array.isArray(products) ? products : []).map((product) => (
            <div
              key={product.id}
              className="bg-primary-light border border-slate-700 rounded-xl overflow-hidden hover:border-accent-cool transition-all hover:shadow-lg hover:shadow-accent-cool/20 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square w-full bg-slate-800 flex items-center justify-center overflow-hidden p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-50 mb-3 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-accent-cool">
                    ₽{product.price.toLocaleString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.stockQuantity > 0
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.stockQuantity > 0 ? `В наличии: ${product.stockQuantity}` : 'Нет в наличии'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}
                  disabled={product.stockQuantity === 0 || addingToCart[product.id]}
                  className="w-full py-2.5 bg-accent-warm text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {addingToCart[product.id] ? 'Добавление...' : 'В корзину'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
