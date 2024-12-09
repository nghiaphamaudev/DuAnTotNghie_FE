import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoginSchema } from "../../../components/common/(client)/sign-in/zod";
import { useAuth } from "../../../contexts/AuthContext";

type LoginForm = z.infer<typeof LoginSchema>;

const LoginAdmin = () => {
  const { loginadmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginForm) => {
    await loginadmin(data);
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-28 h-28 bg-pink-100 rounded-full opacity-30"></div>

        <div className="w-full max-w-md">
          <h2 className="text-center text-2xl lg:text-3xl font-semibold text-gray-800 mb-6">
            Đăng Nhập Trang Quản Trị
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-transparent p-6 rounded-lg border border-gray-200 shadow-lg"
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Nhập email"
                {...register("email")}
                className={`w-full px-4 py-2 border rounded-md text-gray-700 bg-white/70 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Nhập mật khẩu"
                {...register("password")}
                className={`w-full px-4 py-2 border rounded-md text-gray-700 bg-white/70 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
              <span
                className="absolute right-3 top-[34px] text-gray-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
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
        </div>
      </div>
    </>
  );
};

export default LoginAdmin;

