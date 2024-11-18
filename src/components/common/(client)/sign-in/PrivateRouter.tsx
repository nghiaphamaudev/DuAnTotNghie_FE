// AuthGuard.jsx
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
    children: ReactNode; // Chỉ định kiểu cho children là ReactNode
  }

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      navigate("/home"); // Chuyển hướng đến trang chính nếu đã đăng nhập
    }
  }, [navigate]);

  return children; // Trả về các component con nếu chưa đăng nhập
};

export default AuthGuard;
