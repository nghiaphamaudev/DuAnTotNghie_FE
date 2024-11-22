import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import HeaderAdmin from "../components/common/(admin)/HeaderAdmin";

import Product from "../pages/admin/product/Product";
import ProductAdd from "../pages/admin/product/productAdd";
import ProductDetail from "../pages/admin/product/ProductDetail";
import Category from "../pages/admin/category/Category";
import CategoryAdd from "../pages/admin/category/CategoryAdd";
import CategoryEdit from "../pages/admin/category/CategoryEdit";
import Users from "../pages/admin/users/Users";
import PrivateRoute from "../components/common/(client)/sign-in/PrivateRouter";

export default function AdminRouter() {
  return (
    <PrivateRoute requireAdmin>
      <HeaderAdmin>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/add" element={<ProductAdd />} />
          <Route path="/product/detail/:id" element={<ProductDetail />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/add" element={<CategoryAdd />} />
          <Route path="/category/:id" element={<CategoryEdit />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </HeaderAdmin>
    </PrivateRoute>
  );
}
