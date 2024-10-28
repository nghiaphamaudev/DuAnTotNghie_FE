import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserResponse } from "../common/types/User";
import { loginAccount, registerAccount } from "../services/authServices";

type AuthContextProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  register: (formData: User) => void;
  login: (formData: User) => void;
  user: User | null;
  handleLogout: () => void;
};

const AuthContext = createContext({} as AuthContextProps);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  });

  // mutation register
  const { mutateAsync: register } = useMutation({
    mutationFn: async (formData: User) => {
      const data = await registerAccount(formData);
      return data;
    },
  });

  // mutation login
  const { mutateAsync: login } = useMutation({
    mutationFn: async (formData: User) => {
      const data = await loginAccount(formData);
      return data;
    },
    onSuccess: (data: UserResponse) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
    },
  });
  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setIsLogin(false);
      setUser(null);
      notification.success({
        message: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi tài khoản của mình.",
      });
      nav("/home");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      notification.error({
        message: "Đăng xuất thất bại",
        description: "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại sau.",
      });
    }
  };
  
  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, register, login, user, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
