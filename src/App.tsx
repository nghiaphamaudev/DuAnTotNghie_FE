import { Navigate, useRoutes } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientLayout from "./layout/ClientLayout";

import DetailProduct from "./pages/(client)/detail-product/index";
import ShoppingCart from "./pages/(client)/cart";
import HomePage from "./pages/(client)/home";
import LoginPage from "./pages/(client)/sign-in";
import RegisterPage from "./pages/(client)/sign-up";
import ProductPage from "./pages/(client)/product";
import AdminRouter from "./routers/AdminRouter";
import CheckoutPage from "./pages/(client)/checkout";
import VNPayReturn from "./pages/(client)/checkout/nvpayReturn";
import MenuAccount from "./pages/(client)/my-account";
import { ScrollToTop } from "./ultils/client";
import OrderDetail from "./components/common/(client)/menu-account/OrderDetail";
import ResetPassword from "./components/common/(client)/sign-in/ResetPassword";
import PrivateRouter from "./components/common/(client)/menu-account/PrivateRouter";
import { PrivateLoginRegister } from "./components/common/(client)/sign-in/PrivateLoginRegister";
import LoginAdmin from "./pages/admin/users/LoginAdmin";
import NotFound from "./pages/(client)/404";
import AboutUs from "./pages/(client)/about-us";

const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/home" />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "home/product/:id",
        element: <DetailProduct />,
      },
      {
        path: "login",
        element: (
          <PrivateLoginRegister>
            <LoginPage />
          </PrivateLoginRegister>
        ),
      },
      {
        path: "register",
        element: (
          <PrivateLoginRegister>
            <RegisterPage />
          </PrivateLoginRegister>
        ),
      },
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "cart",
        element: <ShoppingCart />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "my-account",
        element: (
          <PrivateRouter>
            <MenuAccount />
          </PrivateRouter>
        ),
      },
      {
        path: "order-detail/:orderId",
        element: <OrderDetail />,
      },
      {
        path: "/vnpay_return",
        element: <VNPayReturn />,
      },
      {
        path: "resetPassword/:resetToken",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />
  },
  {
    path: "/admin/*",
    element: <AdminRouter />,
  },
  {
    path: "/loginadmin",
    element: <LoginAdmin />,
  },
  
];


const App = () => {
  const routers = useRoutes(routeConfig);
  return (
    <main>
      <ScrollToTop />
      {routers}
    </main>
  );
};

export default App;
