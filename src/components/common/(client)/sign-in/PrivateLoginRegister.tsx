import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouterProps {
  children: ReactNode;
}

export const PrivateLoginRegister = ({ children }: PrivateRouterProps) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (user) {
    // Nếu không có thông tin người dùng, chuyển hướng đến trang login
    return <Navigate to="/home" />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return <>{children}</>;
};


