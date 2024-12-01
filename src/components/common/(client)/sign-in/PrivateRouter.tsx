import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (user) {
    return <Navigate to="/home" />; // Nếu đã đăng nhập, chuyển hướng tới trang home
  }

  return <>{children}</>; // Nếu chưa đăng nhập, hiển thị nội dung
};

export default AuthGuard;
