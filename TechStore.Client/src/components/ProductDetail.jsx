import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, cartService, authService } from '../services/api';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addItem(product.id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-accent-cool border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Package size={64} className="mx-auto text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Товар не найден</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-accent-cool text-primary font-medium rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Вернуться в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-50 transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Назад
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-primary-light border border-slate-700 rounded-2xl p-8 flex items-center justify-center">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="max-w-full max-h-[500px] object-contain"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500'; }}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-accent-cool/20 text-accent-cool text-sm font-medium rounded-lg mb-3">
              {product.categoryName || 'Без категории'}
            </span>
            <h1 className="text-4xl font-bold text-slate-50 mb-3">{product.name}</h1>
          </div>

          <div className="mb-6">
            <div className="text-5xl font-bold text-accent-cool mb-2">
              ₽{product.price.toLocaleString()}
            </div>
            <div className="flex items-center gap-3">
              {product.stockQuantity > 0 ? (
                <>
                  <span className="text-green-400 font-medium">В наличии</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{product.stockQuantity} шт.</span>
                </>
              ) : (
                <span className="text-red-400 font-medium">Нет в наличии</span>
              )}
            </div>
          </div>

          <div className="mb-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-50 mb-3">Описание</h3>
            <p className="text-slate-300 leading-relaxed">
              {product.description || 'Описание товара отсутствует.'}
            </p>
          </div>

          {/* Add to Cart Section */}
          {product.stockQuantity > 0 && (
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-slate-300 font-medium">Количество:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                  >
                    −
                  </button>
                  <span className="w-16 text-center text-xl font-semibold text-slate-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-10 h-10 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-4 bg-accent-warm text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart size={24} />
                {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
