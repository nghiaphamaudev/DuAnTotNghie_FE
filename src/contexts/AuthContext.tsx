import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApiError,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  User,
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from "../common/types/User";
import {
  addAddress,
  deleteAddress,
  forgotPassword,
  getProfile,
  loginAccount,
  registerAccount,
  resetPassword,
  updateAddress,
  updatePassword,
  updateProfile,
  updateStatusAddress,
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
  isFetching: boolean;
  isPendingAddAddress: boolean;
  isPendingUpdateAddress: boolean;
  isPendingUpdateStatusAddress: boolean;
  token: string | null;
  showDeleteModal: (addressId: string) => void;
  updateMyPassword: (formData: UpdatePasswordRequest) => void;
  updatestatusAddress: (formData: AddressRequest) => void;
  forgotMyPassword: (formData: ForgotPasswordRequest) => void;
  resetMyPassword: (params: { formData: ResetPasswordRequest; resetToken: string }) => Promise<void>;
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
    onSuccess: () => {
      notification.success({
        message: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo thành công!",
        placement: "topRight",
      });
      nav("/login");
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Đăng ký thất bại",
        description: errorMessage,
        placement: "topRight",
      });
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
      notification.success({
        message: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
        placement: "topRight",
      });
      nav("/home");
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Đăng nhập thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });

  // mutation forgotPassword
  const { mutateAsync: forgotMyPassword } = useMutation({
    mutationFn: async (formData: ForgotPasswordRequest) => {
      const data = await forgotPassword(formData);
      return data;
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Gửi Email thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });

  // mutation resetPassword
  const { mutateAsync: resetMyPassword } = useMutation({
    mutationFn: async ({
      formData,
      resetToken,
    }: {
      formData: ResetPasswordRequest;
      resetToken: string;
    }) => {
      const data = await resetPassword(formData, resetToken);
      return data;
    },
    onSuccess:() => {
      notification.success({
        message: "Đặt lại mật khẩu thành công",
        description: "Vui lòng đăng nhập lại để tiếp tục.",
        placement: "topRight",
      });
      nav("/login")
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Đặt lại mật khẩu thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });
  
  
  // mutation get profile
  const {
    data: userData,
    refetch: refetchUserData,
    isFetching,
  } = useQuery({
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
      localStorage.setItem("user", JSON.stringify(data));
      notification.success({ message: "Cập nhật thông tin thành công!",placement: "topRight", });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Cập nhật thông tin tài khoản thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });

  //mutation update password
  const { mutateAsync: updateMyPassword } = useMutation({
    mutationFn: async (formData: UpdatePasswordRequest) => {
      const data = await updatePassword(formData);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Đổi mật khẩu thành công!",
        description: "Vui lòng đăng nhập lại để tiếp tục.",
        placement: "topRight",
      });
      handleLogout();
      nav("login");
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Đổi mật khẩu thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });
  
  //mutation update address
  const { mutateAsync: updateMyAddress, isPending: isPendingUpdateAddress } =
    useMutation({
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
      onError: (error: ApiError) => {
        const errorMessage = error?.response?.data?.message || error?.message;
        notification.error({
          message: "Cập nhật địa chỉ thất bại",
          description: errorMessage,
          placement: "topRight",
        });
      },
    });

  //mutation update status address
  const {
    mutateAsync: updatestatusAddress,
    isPending: isPendingUpdateStatusAddress,
  } = useMutation({
    mutationFn: async (formData: AddressRequest) => {
      const data = await updateStatusAddress(formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      notification.success({
        message: "Cập nhật địa chỉ mặc định thành công!",
      });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Cập nhật địa chỉ mặc định thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });

  // mutation add address
  const { mutateAsync: addMyAddress, isPending: isPendingAddAddress } =
    useMutation({
      mutationFn: async (formData: AddressRequest) => {
        const data = await addAddress(formData);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        notification.success({ message: "Thêm địa chỉ thành công" });
      },
      onError: (error: ApiError) => {
        const errorMessage = error?.response?.data?.message || error?.message;
        notification.error({
          message: "Thêm địa chỉ thất bại",
          description: errorMessage,
          placement: "topRight",
        });
      },
    });

  //mutation delete address
  const { mutateAsync: deleteMyAddress } = useMutation({
    mutationFn: async (addressId: string) => {
      const data = await deleteAddress({ id: addressId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notification.success({ message: "Xóa địa chỉ thành công" });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || error?.message;
      notification.error({
        message: "Xóa địa chỉ thất bại",
        description: errorMessage,
        placement: "topRight",
      });
    },
  });

  const showDeleteModal = async (addressId: string) => {
    try {
      await deleteMyAddress(addressId);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

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
    refetchUserData(); // Tái thực hiện lại request để lấy thông tin mới
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
        updatestatusAddress,
        deleteMyAddress,
        handleRefetchUser,
        isFetching,
        isPendingAddAddress,
        isPendingUpdateAddress,
        isPendingUpdateStatusAddress,
        showDeleteModal,
        updateMyPassword,
        forgotMyPassword,
        resetMyPassword,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
