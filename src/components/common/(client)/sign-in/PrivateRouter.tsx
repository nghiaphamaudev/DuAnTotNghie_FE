import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute = ({
  children,
  requireAdmin = false
}: PrivateRouteProps) => {
  const userData = localStorage.getItem("useradmin");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <Navigate to="/loginadmin" />;
  }

  if (requireAdmin && !["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
