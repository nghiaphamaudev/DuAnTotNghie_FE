import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../../contexts/AuthContext";
import { RegisterSchema } from "../../../components/common/(client)/sign-in/zod";
import { notification } from "antd";
import { AxiosError } from "axios";

type LoginForm = z.infer<typeof RegisterSchema>;
interface ErrorResponse {
  message?: string;
}

const RegisterPage = () => {
  // context
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();

  // state
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
  });

  //function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await registerAccount(data);

      notification.success({
        message: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo thành công!",
        placement: "topRight",
      });

      navigate("/login");
    } catch (error) {
      if (isAxiosError(error)) {
        // In ra cấu trúc của error.response.data để kiểm tra
        console.error("Register error response:", error.response);

        // Kiểm tra xem response.data có cấu trúc mà bạn mong đợi không
        const errorData = error.response?.data as ErrorResponse;

        if (
          error.response?.status === 400 &&
          errorData.message &&
          errorData.message.includes("Số điện thoại đã tồn tại")
        ) {
          notification.error({
            message: "Đăng ký thất bại",
            description: "Số điện thoại đã tồn tại, vui lòng sử dụng số khác!",
            placement: "topRight",
          });
        } else if (
          error.response?.status === 400 &&
          errorData.message &&
          errorData.message.includes("Email đã tồn tại")
        ) {
          notification.error({
            message: "Đăng ký thất bại",
            description: "Email đã tồn tại, vui lòng sử dụng email khác!",
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Đăng ký thất bại",
            description: "Đã xảy ra sự cố. Vui lòng thử lại sau!",
            placement: "topRight",
          });
        }
      } else {
        notification.error({
          message: "Đăng ký thất bại",
          description: "Đã xảy ra sự cố. Vui lòng thử lại sau!",
          placement: "topRight",
        });
      }

      console.error("Register error:", error);
    }
  };

  // Hàm kiểm tra kiểu
  const isAxiosError = (error: unknown): error is AxiosError => {
    // Kiểm tra xem error có phải là một đối tượng không
    if (typeof error === "object" && error !== null) {
      // Kiểm tra xem đối tượng đó có thuộc tính `isAxiosError`
      return (error as AxiosError).isAxiosError === true;
    }
    return false;
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[50vh] mt-[100px] lg:mt-[200px] px-4">
        <div className="w-full max-w-md mb-4">
          <h2 className="text-center mb-4 text-[24px] lg:text-[35px] font-semibold">
            ĐĂNG KÝ
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label
                htmlFor="fullName"
                className="block text-md font-medium mb-2"
              >
                Họ tên
              </label>
              <input
                type="text"
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                id="fullName"
                placeholder="Nhập họ tên"
                {...register("fullName")}
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs-mt-1">
                  {errors.fullName.message}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="block text-md font-medium mb-2">
                Email
              </label>
              <input
                type="text"
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                id="email"
                placeholder="Nhập email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-xs-mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-3">
              <label
                htmlFor="phoneNumber"
                className="block text-md font-medium mb-2"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                id="phoneNumber"
                placeholder="Nhập số điện thoại"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-md-mt-1">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
            <div className="mb-3 relative">
              <label
                htmlFor="password"
                className="block text-md font-medium mb-2"
              >
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                id="password"
                placeholder="Nhập mật khẩu"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500 text-sm-mt-1">
                  {errors.password.message}
                </span>
              )}
              <span
                className="absolute right-3 top-[41px] cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
            <div className="mb-3 relative">
              <label
                htmlFor="passwordConfirm"
                className="block text-md font-medium mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errors.passwordConfirm ? "border-red-500" : "border-gray-300"
                }`}
                id="passwordConfirm"
                placeholder="Nhập lại mật khẩu"
                {...register("passwordConfirm")}
              />
              {errors.passwordConfirm && (
                <span className="text-red-500 text-md mt-1">
                  {errors.passwordConfirm.message}
                </span>
              )}
              <span
                className="absolute right-3 top-[41px] cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
                  errors.email ||
                  errors.password ||
                  errors.fullName ||
                  errors.phoneNumber ||
                  errors.passwordConfirm
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                Đăng ký
              </button>
            </div>
            <div className="flex items-center justify-center mt-4">
              <hr className="w-full" />
              <span className="px-2 text-gray-500">Hoặc</span>
              <hr className="w-full" />
            </div>
          </form>
          <div className="text-center mt-3">
            <p>
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="text-red-500">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
