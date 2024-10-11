import { Navigate, useRoutes } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientLayout from "./layout/ClientLayout";
import HomePage from "./pages/(client)/home";

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
      }
    ]
  }
];

const App = () => {
  const routers = useRoutes(routeConfig);
  return <main>{routers}</main>;
};

export default App;
