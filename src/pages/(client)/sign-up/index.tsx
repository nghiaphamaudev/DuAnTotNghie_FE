import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../../contexts/AuthContext";

const LoginSchema = z
  .object({
    email: z
      .string()
      .nonempty("Vui lòng nhập email")
      .email("Email không hợp lệ")
      .refine(
        (value) =>
          value.endsWith("@gmail.com") ||
          value.endsWith("@yahoo.com") ||
          value.endsWith("@fpt.edu.vn"),
        "Chưa đúng định dạng email"
      ),
    password: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải lớn hơn 8 kí tự ")
      .regex(/[a-z]/, "Mật khẩu ít nhất phải có một chữ thường")
      .regex(/[A-Z]/, "Mật khẩu ít nhất phải có một chữ hoa")
      .regex(/[\d]/, "Mật khẩu ít nhất phải có một số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu ít nhất phải có một ký tự đặc biệt"),
    fullName: z.string().nonempty("Vui lòng nhập tên người dùng"),
    phoneNumber: z
      .string()
      .nonempty("Vui lòng nhập số điện thoại")
      .regex(
        /^0\d{9}$/,
        "Số điện thoại phải bắt đầu bằng số 0 và bao gồm 10 chữ số"
      ),
    passwordConfirm: z.string().nonempty("Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["passwordConfirm"],
  });

type LoginForm = z.infer<typeof LoginSchema>;

const RegisterPage = () => {
  // context
  const { register: registerAccount } = useAuth();

  // state
  const [showPassword, setShowPassword] = useState(false);

  //validate Schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  //function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit =  async (data: LoginForm) => {
    try {
      const res = await registerAccount(data);
      console.log('Register response:', res);
  } catch (error) {
      console.error('Registration error:', error);
  }
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
                className={`form-input w-full px-4 py-2 border rounded-lg ${errors.fullName ? "border-red-500" : "border-gray-300"
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
                className={`form-input w-full px-4 py-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"
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
              <label htmlFor="phoneNumber" className="block text-md font-medium mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                className={`form-input w-full px-4 py-2 border rounded-lg ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
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
                className={`form-input w-full px-4 py-2 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"
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
                className={`form-input w-full px-4 py-2 border rounded-lg ${errors.passwordConfirm ? "border-red-500" : "border-gray-300"
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
                className="w-full py-2 bg-blue-500 text-white rounded-lg"
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
