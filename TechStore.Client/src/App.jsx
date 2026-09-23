import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Profile from './components/Profile';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { cartService, authService } from './services/api';

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    loadCartCount();

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCartCount = async () => {
    if (!authService.isAuthenticated()) {
      setCartItemsCount(0);
      return;
    }

    try {
      const cart = await cartService.getCart();
      const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(count);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartItemsCount(0);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-primary">
        <Header cartItemsCount={cartItemsCount} />
        <main>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
