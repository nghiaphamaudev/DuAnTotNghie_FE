import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouterProps {
  children: ReactNode;
}

const PrivateRouter = ({ children }: PrivateRouterProps) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default PrivateRouter;
