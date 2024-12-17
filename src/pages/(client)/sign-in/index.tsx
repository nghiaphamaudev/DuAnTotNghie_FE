import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import ForgotPasswordModal from "../../../components/common/(client)/sign-in/Modal";
import { LoginSchema } from "../../../components/common/(client)/sign-in/zod";
import { useAuth } from "../../../contexts/AuthContext";

type LoginForm = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const { login: loginAccount } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedEmail !== null) {
      setValue("email", savedEmail);
    }

    if (savedPassword !== null) {
      setValue("password", savedPassword);
    }

    if (savedEmail && savedPassword) {
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    if (isForgotPasswordOpen) {
      return;
    }
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
      localStorage.setItem("rememberedPassword", data.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
    await loginAccount(data);
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

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
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                  className="form-checkbox mr-2"
                />
                <label className="text-md" htmlFor="remember">
                  Nhớ tài khoản
                </label>
              </div>
              <div>
                <div className="text-md text-blue-500 cursor-pointer" onClick={showModal}>
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
