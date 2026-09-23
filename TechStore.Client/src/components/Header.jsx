import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogOut } from 'lucide-react';

export default function Header({ cartItemsCount }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-cool rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-semibold text-slate-50">TechStore</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="text-slate-300 hover:text-slate-50 transition-colors relative"
                >
                  Корзина
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-accent-warm text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className="text-slate-300 hover:text-slate-50 transition-colors"
                >
                  Заказы
                </Link>

                <Link
                  to="/profile"
                  className="text-slate-300 hover:text-slate-50 transition-colors"
                >
                  Профиль
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-slate-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-accent-cool text-primary px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
