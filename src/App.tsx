import { Navigate, useRoutes } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientLayout from "./layout/ClientLayout";
import ShoppingCart from "./pages/(client)/cart";
import HomePage from "./pages/(client)/home";
import LoginPage from "./pages/(client)/sign-in";
import RegisterPage from "./pages/(client)/sign-up";
import ProductPage from "./pages/(client)/product";
import CheckoutPage from "./pages/(client)/checkout";

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
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
        path: "product",
        element: <ProductPage />
      },
      {
        path: "cart",
        element: <ShoppingCart />
      },
      {
        path: "checkout",
        element: <CheckoutPage />
      }
    ]
  }
];

const App = () => {
  const routers = useRoutes(routeConfig);
  return <main>{routers}</main>;
};

export default App;
