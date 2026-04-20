import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Category from '../pages/Category';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Checkout from '../pages/Checkout';
import AdminDashboard from '../Admin/AdminDashboard';
import Termpolices from '../pages/Termpolices'
import ForgetPassword from '../pages/ForgetPassword'
import SearchResults from '../pages/SearchResult' // ✅ Fixed spelling (Added 's')
import NotFound from '../pages/NotFound'; // ✅ New 404 Page
// 🛡️ ADMIN PROTECTOR COMPONENT
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // User object storage se liya

  if (!token || user?.role !== 'admin') {
    // Agar token nahi ya role admin nahi, to home page pe bhej do
    return <Navigate to="/" replace />;
  }
  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/Forget" element={<ForgetPassword />} />
        <Route path="/" element={<Home />} />
         <Route path="/contact" element={<Contact />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/terms-policies" element={<Termpolices />} />
       

        {/* 🔒 Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/add-product" 
          element={
            <AdminRoute>
            </AdminRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRoutes;