import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService, orderService, authService } from '../services/api';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [shippingAddress, setShippingAddress] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error.response?.status === 401 || error.response?.status === 400) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await cartService.updateItem(productId, newQuantity);
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await cartService.removeItem(productId);
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      return;
    }

    setCreatingOrder(true);
    try {
      const order = await orderService.createOrder(shippingAddress);
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-accent-cool border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <ShoppingBag size={64} className="mx-auto text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Корзина пуста</h2>
        <p className="text-slate-400 mb-6">Добавьте товары из каталога</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-accent-cool text-primary font-medium rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-slate-50">Корзина</h1>
        {cart.items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-400 hover:text-red-300 transition-colors text-sm"
          >
            Очистить корзину
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const cartItemId = item.id;
            const productName = item.productName || item.name || 'Товар';
            const productPrice = item.productPrice || item.price || 0;
            const productImage = item.productImageUrl || item.imageUrl || 'https://via.placeholder.com/150';
            const productDescription = item.productDescription || item.description || '';
            const productStock = item.productStockQuantity || item.stockQuantity || 0;

            return (
              <div
                key={cartItemId}
                className="bg-primary-light border border-slate-700 rounded-xl p-4 flex gap-4"
              >
                <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                  <img
                    src={productImage}
                    alt={productName}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-50 mb-1">
                    {productName}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                    {productDescription}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-accent-cool">
                      ₽{productPrice.toLocaleString()}
                    </span>
                    {productStock > 0 && (
                      <span className="text-xs text-slate-500">
                        В наличии: {productStock}
                      </span>
                    )}
                  </div>
                </div>

                {/* Правая часть с кнопочным блоком и итоговой стоимостью */}
                <div className="flex flex-col items-end justify-between">
                  <div className="flex flex-col items-start gap-2">
                    {/* Строка со счетчиком */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(cartItemId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating[cartItemId]}
                        className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold text-slate-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(cartItemId, item.quantity + 1)}
                        disabled={item.quantity >= productStock || updating[cartItemId]}
                        className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Кнопка удаления ровно под знаком "-" */}
                    <button
                      onClick={() => handleRemoveItem(cartItemId)}
                      disabled={updating[cartItemId]}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Итоговая сумма за товар */}
                  <div className="text-right mt-2">
                    <div className="text-sm text-slate-500">Итого:</div>
                    <div className="text-xl font-bold text-slate-50">
                      ₽{(productPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-primary-light border border-slate-700 rounded-xl p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Оформление</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Товаров:</span>
                <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Сумма:</span>
                <span>₽{cart.totalAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-xl font-bold text-slate-50">
                <span>Итого:</span>
                <span className="text-accent-cool">₽{cart.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Адрес доставки
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Введите адрес доставки..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={creatingOrder}
                className="w-full py-3 bg-accent-warm text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingOrder ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}