import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    // Nếu không có thông tin người dùng, chuyển hướng đến trang login
    return <Navigate to="/login" />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return <>{children}</>;
};

export default PrivateRoute;
