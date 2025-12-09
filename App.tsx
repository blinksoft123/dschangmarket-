import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { SellerDashboard } from './pages/SellerDashboard';
import { Auth } from './pages/Auth';
import { CartProvider } from './hooks/useCart';

// Simple Cart Page Component
const CartPage: React.FC = () => {
    return <Checkout />; // Reusing checkout logic for simplicity in demo
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* In a real app, this route would be protected by Auth Guard */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </CartProvider>
  );
};

export default App;
