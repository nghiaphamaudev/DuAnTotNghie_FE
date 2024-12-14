import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouterProps {
  children: ReactNode;
}

export const PrivateRouteAdmin = ({ children }: PrivateRouterProps) => {
  const userData = localStorage.getItem("useradmin");
  const user = userData ? JSON.parse(userData) : null;

  if (user) {
    return <Navigate to="/admin" />;
  }
  return <>{children}</>;
};
