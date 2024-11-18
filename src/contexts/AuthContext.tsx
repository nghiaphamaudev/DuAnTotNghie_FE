import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal, notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from "../common/types/User";
import {
  addAddress,
  deleteAddress,
  getProfile,
  loginAccount,
  registerAccount,
  updateAddress,
  updateProfile,
} from "../services/authServices";
import { AddressRequest } from "../common/types/Address";

type AuthContextProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  register: (formData: UserRegisterRequest) => void;
  login: (formData: UserLoginRequest) => void;
  user: User | null;
  handleLogout: () => void;
  updateUser: (formData: User) => void;
  addMyAddress: (formData: AddressRequest) => void;
  updateMyAddress: (formData: AddressRequest) => void;
  deleteMyAddress: (id: string) => void;
  userData: User;
  handleRefetchUser: () => void;
  isFetching : boolean;
  isPendingAddAddress: boolean;
  isPendingUpdateAddress: boolean;
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token) {
      setIsLogin(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Khôi phục dữ liệu người dùng từ localStorage
      }
    } else {
      setIsLogin(false);
    }
  }, [token]);

  // mutation register
  const { mutateAsync: register } = useMutation({
    mutationFn: async (formData: UserRegisterRequest) => {
      const data = await registerAccount(formData);
      return data;
    },
  });

  // mutation login
  const { mutateAsync: login } = useMutation({
    mutationFn: async (formData: UserLoginRequest) => {
      const data = await loginAccount(formData);
      return data;
    },
    onSuccess: (data: UserResponse) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));
      setUser(data.data);
    },
  });

  // mutation get profile
  const { data: userData, refetch: refetchUserData, isFetching  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data;
    },
    enabled: !!token,
  });

  // mutation updateProfile
  const { mutateAsync: updateUser } = useMutation({
    mutationFn: async (formData: User) => {
      const data = await updateProfile(formData);
      return data;
    },
    onSuccess: (data: UserResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      localStorage.setItem("user", JSON.stringify(data)); // Cập nhật thông tin người dùng trong localStorage
      notification.success({ message: "Cập nhật thông tin thành công!" });
    },
    onError: (error) => {
      notification.error({
        message: "Cập nhật thông tin tài khoản thất bại",
        description: "Vui lòng kiểm tra lại dữ liệu và thử lại.",
      });
      console.error("Update profile error:", error); // Ghi log lỗi nếu có
    },
  });

  //mutation update address
  const { mutateAsync: updateMyAddress, isPending: isPendingUpdateAddress } = useMutation({
    mutationFn: async (formData: AddressRequest) => {
      const data = await updateAddress(formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      notification.success({ message: "Cập nhật địa chỉ thành công!" });
    },
    onError: () => {
      notification.error({
        message: "Cập nhật địa chỉ thất bại",
        description: "Vui lòng kiểm tra lại dữ liệu và thử lại.",
      });
    },
  });

  // mutation add address
  const { mutateAsync: addMyAddress, isPending: isPendingAddAddress } = useMutation({
    mutationFn: async (formData: AddressRequest) => {
      const data = await addAddress(formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notification.success({ message: "Thêm địa chỉ thành công"})
    },
  });

  //mutation delete address
  const { mutateAsync: deleteMyAddress } = useMutation({
    mutationFn: async (addressId: string) => {
      const data = await deleteAddress({ id: addressId });
      return data;
    },
    onSuccess: () => {
      Modal.confirm({
        title: "Xóa địa chỉ",
        content: "Bạn có chắc chắn muốn xóa địa chỉ này?",
        onOk: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          notification.success({ message: "Xóa địa chỉ thành công" });  
        },
      });
    },
    onError: () => {
      notification.error({
        message: "Xóa địa chỉ thất bại",
        description: "Vui lòng thử lại sau.",
      });
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

  const handleRefetchUser = () => {
    refetchUserData (); // Tái thực hiện lại request để lấy thông tin mới
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        register,
        login,
        user,
        handleLogout,
        addMyAddress,
        updateUser,
        userData,
        updateMyAddress,
        deleteMyAddress,
        handleRefetchUser,
        isFetching ,
        isPendingAddAddress,
        isPendingUpdateAddress,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
