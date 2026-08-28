import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

// Customer Layout & Components
import CustomerLayout from './layouts/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { Loader2 } from 'lucide-react';

// Customer Pages (Eagerly loaded for instant customer experience)
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderSuccess from './pages/customer/OrderSuccess';
import Orders from './pages/customer/Orders';
import OrderDetails from './pages/customer/OrderDetails';
import Profile from './pages/customer/Profile';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Contact from './pages/customer/Contact';
import NotFound from './pages/NotFound';

// Admin Pages (Code-split & lazy loaded)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const PageFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
    <span className="text-xs font-semibold text-slate-500">Loading Surya Stores...</span>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <SettingsProvider>
            <Router>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Public & Customer Portal (Wrapped in CustomerLayout) */}
                  <Route element={<CustomerLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Customer Protected Routes */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-success/:id"
                      element={
                        <ProtectedRoute>
                          <OrderSuccess />
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
                      path="/orders/:id"
                      element={
                        <ProtectedRoute>
                          <OrderDetails />
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
                  </Route>

                  {/* Admin Auth Portal */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedAdminRoute>
                        <AdminProducts />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCategories />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedAdminRoute>
                        <AdminOrders />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCustomers />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedAdminRoute>
                        <AdminSettings />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </SettingsProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
