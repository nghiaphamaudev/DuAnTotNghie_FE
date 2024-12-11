import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouterProps {
  children: ReactNode;
}

export const PrivateRouteAdmin = ({ children }: PrivateRouterProps) => {
  const userData = localStorage.getItem("useradmin");
  const user = userData ? JSON.parse(userData) : null;

  if (user) {
    // Nếu không có thông tin người dùng, chuyển hướng đến trang login
    return <Navigate to="/admin" />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return <>{children}</>;
};
