import { Navigate, useRoutes } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientLayout from "./layout/ClientLayout";
import HomePage from "./pages/(client)/home";
import ProductPage from "./pages/(client)/product";
import AdminRouter from "./routers/AdminRouter";
// import CheckoutPage from "./pages/(client)/checkout";


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
      // comit code lên kiểu j h nhỉ
      // 
      // {
      //   path: "checkout",
      //   element: <CheckoutPage />
      // }
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
