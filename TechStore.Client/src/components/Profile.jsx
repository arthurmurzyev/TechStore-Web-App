import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';
import { User, Mail, Lock, Save } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setEmail(currentUser.email || '');
  }, [navigate]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }

    setUpdatingEmail(true);
    try {
      await userService.updateEmail(email);
      const updatedUser = { ...user, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating email:', error);
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    if (newPassword.length < 6) {
      return;
    }

    setUpdatingPassword(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-accent-cool border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-50 mb-2">Профиль пользователя</h1>
        <p className="text-slate-400">Управление вашими данными</p>
      </div>

      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-primary-light border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <User size={24} className="text-accent-cool" />
            Информация
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-400">Имя:</span>
              <p className="text-lg text-slate-50">{user.fullName}</p>
            </div>
            <div>
              <span className="text-sm text-slate-400">Email:</span>
              <p className="text-lg text-slate-50">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Update Email */}
        <div className="bg-primary-light border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <Mail size={24} className="text-accent-cool" />
            Изменить Email
          </h2>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Новый Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-2.5 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={updatingEmail}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-cool text-primary font-medium rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {updatingEmail ? 'Сохранение...' : 'Сохранить Email'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-primary-light border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            <Lock size={24} className="text-accent-cool" />
            Изменить пароль
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Повторите новый пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-primary border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-accent-cool transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPassword}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-warm text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock size={18} />
              {updatingPassword ? 'Изменение...' : 'Изменить пароль'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
