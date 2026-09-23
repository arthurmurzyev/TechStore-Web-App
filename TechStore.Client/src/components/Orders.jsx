import { useState, useEffect } from 'react';
import { orderService, paymentService } from '../services/api';
import { Package, CreditCard, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const statusConfig = {
  Pending: { label: 'В ожидании', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  Paid: { label: 'Оплачен', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  Shipped: { label: 'Отправлен', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  Cancelled: { label: 'Отменен', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId) => {
    setPaying(prev => ({ ...prev, [orderId]: true }));
    try {
      await paymentService.processPayment(orderId);
      await loadOrders();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setPaying(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-accent-cool border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <Package size={64} className="mx-auto text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-50 mb-2">У вас пока нет заказов</h2>
        <p className="text-slate-400">Оформите первый заказ в каталоге</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-slate-50 mb-8">Мои заказы</h1>

      <div className="space-y-6">
        {(orders || []).map((order) => {
          const statusInfo = statusConfig[order.orderStatus] || statusConfig.Pending;
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={order.id}
              className="bg-primary-light border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-50">
                      Заказ #{order.id}
                    </h3>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon size={16} />
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-1">Сумма заказа</div>
                  <div className="text-2xl font-bold text-accent-cool">
                    ₽{order.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                <div className="text-sm font-medium text-slate-400 mb-1">Адрес доставки:</div>
                <div className="text-slate-200">{order.shippingAddress}</div>
              </div>

              <div className="space-y-3 mb-4">
                {(order.items || order.orderItems || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                      <img
                        src={item.productImageUrl || item.product?.imageUrl || item.imageUrl || 'https://via.placeholder.com/150'}
                        alt={item.productName || item.product?.name || 'Товар'}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-50 mb-1">
                        {item.productName || item.product?.name || 'Товар'}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Количество: {item.quantity}</span>
                        <span>Цена: ₽{(item.priceAtOrder || item.priceAtPurchase || item.price || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500">Итого:</div>
                      <div className="font-bold text-slate-50">
                        ₽{((item.priceAtOrder || item.priceAtPurchase || item.price || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.orderStatus === 'Pending' && (
                <button
                  onClick={() => handlePayment(order.id)}
                  disabled={paying[order.id]}
                  className="w-full py-3 bg-accent-warm text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  {paying[order.id] ? 'Обработка...' : 'Оплатить заказ'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
