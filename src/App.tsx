import { Navigate, useRoutes } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientLayout from "./layout/ClientLayout";
import DetailProduct from "./pages/(client)/detail-product/index";
import HomePage from "./pages/(client)/home";
import ProductPage from "./pages/(client)/product";
import AdminRouter from "./routers/AdminRouter";
import ShoppingCart from "./pages/(client)/cart";
import CheckoutPage from "./pages/(client)/checkout";
import LoginPage from "./pages/(client)/sign-in";
import RegisterPage from "./pages/(client)/sign-up";

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
        path: "product",
        element: <ProductPage />
      },
      {
        path: "detail-product",
        element: <DetailProduct />
      },
      {
        path: "cart",
        element: <ShoppingCart />
      },
      {
        path: "checkout",
        element: <CheckoutPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
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
