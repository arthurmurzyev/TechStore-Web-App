import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Предотвращаем всплытие события
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.register(formData.email, formData.password, formData.fullName);
      }
      setError(''); // Сбрасываем ошибку только при успехе
      navigate('/');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Auth error:', err);

      if (isLogin) {
        setError('Неверный Email или пароль');
      } else {
        const serverError = typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message;

        setError(serverError || 'Ошибка при регистрации. Попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    // Сбрасываем введенные данные при переключении между входом и регистрацией
    setFormData({
      email: '',
      password: '',
      fullName: '',
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-cool/20 rounded-2xl mb-4">
            <User size={32} className="text-accent-cool" />
          </div>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">
            {isLogin ? 'Вход в TechStore' : 'Регистрация'}
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <div className="bg-primary-light border border-slate-700 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Имя и фамилия
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Иван Иванов"
                    autoComplete="off"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
                />
              </div>
              {!isLogin && (
                <p className="mt-2 text-xs text-slate-500">Минимум 6 символов</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-cool text-primary font-semibold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-accent-cool hover:text-cyan-400 transition-colors text-sm"
            >
              {isLogin
                ? 'Нет аккаунта? Зарегистрируйтесь'
                : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}