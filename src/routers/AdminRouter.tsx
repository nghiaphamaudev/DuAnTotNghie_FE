import { Routes, Route, Navigate } from "react-router-dom";
// import Dashboard from "../pages/admin/dashboard/Dashboard";
// import Bill from "../pages/admin/bill/Bill";
// import Product from "../pages/admin/product/Product";
import Category from "../pages/admin/category/Category";
// import Staff from "../pages/admin/account/staff/Staff";
import ProductEdit from "../pages/admin/product/ProductEdit";
import CategoryAdd from "../pages/admin/category/CategoryAdd";
import CategoryEdit from "../pages/admin/category/CategoryEdit";
// import ProductDetailAndEdit from "../pages/admin/product/ProductDetailAndEdit";
// import BillDetail from "../pages/admin/bill/BillDetail";
import Size from "../pages/admin/size/Size";
import Users from "../pages/admin/users/Users";
import ProductAdd from "../pages/admin/product/productAdd";
import PageComment from "../pages/admin/comment/PageComment";
// import ChangePassword from "../pages/admin/changepassword/ChangePassword";
import Voucher from "../pages/admin/voucher/voucher";
import VoucherAdd from "../pages/admin/voucher/voucherAdd";

import Product from "../pages/admin/product/Product";
import HeaderAdmin from "../components/common/(admin)/HeaderAdmin";

export default function AdminRouter() {
  return (
    <HeaderAdmin>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/product" />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/bill" element={<Bill />} />
        <Route path="/bill/detail/:id" element={<BillDetail />} />*/}
        <Route path="/product" element={<Product />} />
        {/* <Route path="/product/detail/:id" element={<ProductDetailAndEdit />} /> */}
        <Route path="/product/add" element={<ProductAdd />} />
        <Route path="/product/:id" element={<ProductEdit />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/add" element={<CategoryAdd />} />
        <Route path="/category/:id" element={<CategoryEdit />} />
        <Route path="/size" element={<Size />} />
        {/* <Route path="/staff" element={<Staff />} /> */}
        <Route path="/users" element={<Users />} />
        <Route path="/comments" element={<PageComment />} />
        {/* <Route path="/change-password" element={<ChangePassword />} /> */}
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/voucher/add" element={<VoucherAdd />} />
      </Routes>
    </HeaderAdmin>
  );
}
