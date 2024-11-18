import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { LoginSchema } from "../../../components/common/(client)/sign-in/zod";
import ForgotPasswordModal from "../../../components/common/(client)/sign-in/Modal";
import { useAuth } from "../../../contexts/AuthContext";
import { notification } from "antd";
// validate login

type LoginForm = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  // context
  const { login: loginAccount } = useAuth();

  // state
  const [showPassword, setShowPassword] = useState(false);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  //navigate
  const navigate = useNavigate();

  // function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setIsForgotPasswordOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // validate Schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginForm) => {
    if (isForgotPasswordOpen) {
      return;
    }
    try {
      await loginAccount(data);

      notification.success({
        message: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại!",
        placement: "topRight",
      });

      navigate("/home");
    } catch (error) {
      // Hiển thị thông báo đăng nhập thất bại
      notification.error({
        message: "Đăng nhập thất bại",  
        description: "Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại!",
        placement: "topRight",
      });

      console.error("Login error:", error);
    }
  };

  // Form quên mật khẩu
  return (
    <>
      <div className="flex justify-center items-center min-h-[50vh] mt-[100px] lg:mt-[200px] px-4">
        <div className="w-full max-w-md mb-4">
          <h2 className="text-center mb-4 text-[24px] lg:text-[35px] font-semibold">
            ĐĂNG NHẬP
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <span className="text-red-500 text-xs-mt-1">
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
            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  className="form-checkbox mr-2"
                  type="checkbox"
                  id="remember"
                />
                <label className="text-md" htmlFor="remember">
                  Nhớ tài khoản
                </label>
              </div>
              <div>
                <div className="text-md text-blue-500" onClick={showModal}>
                  Quên mật khẩu
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
                errors.email || errors.password ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              Đăng nhập
            </button>
          </form>
          <div className="flex items-center justify-center mt-4">
            <hr className="w-full" />
            <span className="px-2 text-gray-500">Hoặc</span>
            <hr className="w-full" />
          </div>
          <div className="text-center mt-3">
            <p>
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-red-500">
                Đăng kí
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ForgotPasswordModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={function (): void {}}
      />
    </>
  );
};

export default LoginPage;
