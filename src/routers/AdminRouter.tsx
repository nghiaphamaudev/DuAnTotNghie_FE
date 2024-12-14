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
import ProductEdit from "../pages/admin/product/ProductEdit";
import CategoryDetail from "../pages/admin/category/CategoryDetail";
import PageComment from "../pages/admin/comment/PageComment";
import Voucher from "../pages/admin/voucher/voucher";
import VoucherAdd from "../pages/admin/voucher/voucherAdd";
import Orders from "../pages/admin/order/Order";
import AdminOrderDetail from "../pages/admin/order/AdminOrderDetail";
import ChangePassword from "../pages/admin/resetpassword/ChangePassword";

export default function AdminRouter() {
  return (
    <PrivateRoute requireAdmin>
      <HeaderAdmin>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/detail/:id" element={<ProductDetail />} />
          <Route path="/product/add" element={<ProductAdd />} />
          <Route path="/product/:id" element={<ProductEdit />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/add" element={<CategoryAdd />} />
          <Route path="/category/:id" element={<CategoryEdit />} />
          <Route path="/category/detail/:id" element={<CategoryDetail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/comments" element={<PageComment />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/voucher" element={<Voucher />} />
          <Route path="/voucher/add" element={<VoucherAdd />} />
          <Route path="/bill" element={<Orders />} />
          <Route path="/bill/:orderId" element={<AdminOrderDetail />} />
        </Routes>
      </HeaderAdmin>
    </PrivateRoute>
  );
}
