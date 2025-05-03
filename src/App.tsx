import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home, About, Contact, Products, ProductPreview, Cart, Checkout, Login } from "./pages";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoutes";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Register from "./components/auth/Register";
import WishlistPage from "./pages/WishlistPage";
import BlogRoutes from "./routes/BlogRoutes";

import AdminRoutes from "./routes/AdminRoutes";

const App: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading....</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductPreview />} />



      <Route path="/order-confirmation/:orderId"
        element={
          <ProtectedRoute >
            <OrderConfirmation />
          </ProtectedRoute>
        } />
      <Route path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;