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
import AuthGuard from "./pages/(client)/sign-in/PrivateRouter";
import MenuAccount from "./pages/(client)/my-account";


const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/home" />
      },
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "home/product/:id",
        element: <DetailProduct />
      },
      {
        path: "login",
        element: (
          <AuthGuard>
            <LoginPage/>
          </AuthGuard>
        )
      },
      {
        path: "register",
        element: (
          <AuthGuard>
            <RegisterPage/>
          </AuthGuard>
        )
      },
      {
        path: "product",
        element: <ProductPage />
      },
      
      {
        path: "checkout",
        element: <CheckoutPage />
      },
      {
        path: "my-account",
        element: <MenuAccount />
      }
    ]
  },
  {
  path: "/admin/*",
    element: <AdminRouter />
  }
];

const App = () => {
  const routers = useRoutes(routeConfig);
  return <main>{routers}</main>;
};

export default App;
