import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRequest, UserResponse } from "../common/types/User";
import { addAddress, getProfile, loginAccount, registerAccount } from "../services/authServices";
import { useCart } from "./CartContext";

type AuthContextProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  register: (formData: User) => void;
  login: (formData: UserRequest) => void;
  user: User | null;
  handleLogout: () => void;
  addMyAddress: (formData: any) => void;
  token: string | null;
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
  //hooks
  const nav = useNavigate();

  //state
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [token]);

  // mutation register
  const { mutateAsync: register } = useMutation({
    mutationFn: async (formData: User) => {
      const data = await registerAccount(formData);
      return data;
    },
  });

  // mutation login
  const { mutateAsync: login } = useMutation({
    mutationFn: async (formData: UserRequest) => {
      const data = await loginAccount(formData);
      return data;
    },
    onSuccess: (data: UserResponse) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));
    },
  });

  // mutation add address
  const { mutateAsync: addMyAddress } = useMutation({
    mutationFn: async (formData: any) => {
      const data = await addAddress(formData);
      return data;
    },
  });

  // mutation get profile
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getProfile()
      setUser(res.data)
      return res.data
    },
    enabled: !!token
  })

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
      value={{ isLogin, setIsLogin, register, login, user, handleLogout, addMyAddress, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
