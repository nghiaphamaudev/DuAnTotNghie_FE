import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const LoginSchema = z.object({
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
});

type LoginForm = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  //state
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

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-full max-w-md mb-4">
          <h2 className="text-center mb-4 text-2xl font-semibold">ĐĂNG NHẬP</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="text"
                className="form-input w-full px-4 py-2 border rounded-lg"
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
                className="block text-sm font-medium mb-2"
              >
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input w-full px-4 py-2 border rounded-lg"
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
                className="absolute right-3 top-[38px] cursor-pointer"
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
                <label className="text-sm" htmlFor="remember">
                  Nhớ tài khoản
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600">
                Quên mật khẩu?
              </a>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-info w-full py-2 bg-blue-500 text-white rounded-lg"
              >
                Đăng nhập
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
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-red-500">
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
