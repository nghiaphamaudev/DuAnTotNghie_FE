import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../../contexts/AuthContext";

// validate login
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

//validate quên mk
const ForgotPasswordSchema = z.object({
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
});

//validate nhập otp
const OtpSchema = z.object({
  otp: z
    .string()
    .nonempty("Vui lòng nhập mã OTP")
    .length(6, "Mã OTP bao gồm 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ được chứa các chữ số"),
});

//validate đổi mk
const ChangePasswordSchema = z
  .object({
    newpassword: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải lớn hơn 8 kí tự ")
      .regex(/[a-z]/, "Mật khẩu ít nhất phải có một chữ thường")
      .regex(/[A-Z]/, "Mật khẩu ít nhất phải có một chữ hoa")
      .regex(/[\d]/, "Mật khẩu ít nhất phải có một số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu ít nhất phải có một ký tự đặc biệt"),

    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newpassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Đặt lỗi tại trường confirmPassword
  });

type LoginForm = z.infer<typeof LoginSchema>;
type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
type OtpForm = z.infer<typeof OtpSchema>;
type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

const LoginPage = () => {
  // context 
  const { login: loginAccount } = useAuth();

  // state 
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false); // Form đổi mật khẩu
  const [email, setEmail] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const showModal = () => {
    setIsModalOpen(true);
    setIsEmailVerified(false);
    setIsOTPVerified(false);
    setIsChangePassword(false);
    setIsForgotPasswordOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
      const res = await loginAccount(data);
      console.log(res); // chuyển trang thông báo làm ở đây
    } catch (error) {
      
    }
  };

  // Form quên mật khẩu
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmitEmail = (data: ForgotPasswordForm) => {
    setEmail(data.email);
    setIsEmailVerified(true);
    console.log("Email đã xác nhận:", data.email);
  };

  // Form nhập mã otp
  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: errorsOTP },
  } = useForm<OtpForm>({
    resolver: zodResolver(OtpSchema),
    mode: "onBlur",
  });

  const onSubmitOTP = (data: OtpForm) => {
    console.log("OTP: ", data.otp);
    setIsOTPVerified(true);
    setIsChangePassword(true);
  };

  // Form đổi mật khẩu khi đúng otp
  const {
    register: registerChangePassword,
    handleSubmit: handleChangePassword,
    formState: { errors: errorsChangePassword },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });

  const onSubmitChangePassword = (data: ChangePasswordForm) => {
    console.log("Password: ", data.newpassword);
    setIsChangePassword(false);
    handleOk();
    setIsEmailVerified(false);
    setEmail("");
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
                  className="form-checkbox mr-2"
                  type="checkbox"
                  id="remember"
                />
                <label className="text-md" htmlFor="remember">
                  Nhớ tài khoản
                </label>
              </div>
              <div>
                <a className="text-md text-blue-600" onClick={showModal}>
                  Quên mật khẩu?
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-md w-full mt-4 hover:bg-blue-600"
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
      <Modal
        title={
          <div className="relative">
            <h2 className="text-lg font-semibold">Quên mật khẩu</h2>
            <hr className="mt-2 border-t border-gray-300" />
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        maskClosable={true}
        onCancel={handleCancel}
        footer={null}
        styles={{ mask: { backgroundColor: "rgba(0, 0, 0, 0.7)" } }}
      >
        {!isEmailVerified ? (
          <form
            onSubmit={handleSubmitForgot(onSubmitEmail)}
            className="mt-[20px]"
          >
            <p className="text-md font-semibold mt-[10px]">
              Vui lòng nhập địa chỉ email đã đăng ký của bạn để nhận mã OTP từ
              chúng tôi.
            </p>
            <input
              type="text"
              className={`form-input  mt-[20px] w-full px-4 py-2 border rounded-lg ${
                errorsForgot.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập email"
              {...registerForgot("email")}
            />
            {errorsForgot.email && (
              <span className="text-red-500 text-xs mt-1">
                {errorsForgot.email.message}
              </span>
            )}
            <button
              type="submit"
              className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
                errorsForgot.email ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              Xác nhận
            </button>
          </form>
        ) : !isOTPVerified ? (
          <form onSubmit={handleSubmitOTP(onSubmitOTP)}>
            <p className="text-md font-semibold mt-[10px]">
              Mã OTP đã được gửi tới email: {email}
            </p>{" "}
            {/* Bổ sung <strong> để nhấn mạnh email */}
            <input
              type="text"
              className={`form-input  mt-[20px] w-full px-4 py-2 border rounded-lg ${
                errorsOTP.otp ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mã OTP"
              {...registerOTP("otp")}
            />
            {errorsOTP.otp && (
              <span className="text-red-500 text-xs mt-1">
                {errorsOTP.otp.message}
              </span>
            )}
            <button
              type="submit"
              className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
                errorsOTP.otp ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              Xác nhận OTP
            </button>
          </form>
        ) : isChangePassword ? (
          <form onSubmit={handleChangePassword(onSubmitChangePassword)}>
            <p className="text-md font-semibold mt-[10px]">
              Vui lòng đổi mật khẩu để đăng nhập lại
            </p>
            <div className="mb-3 relative mt-[20px]">
              <label
                htmlFor="newpassword"
                className="block text-md font-medium mb-2"
              >
                Mật khẩu mới
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errorsChangePassword.newpassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                id="newpassword"
                placeholder="Nhập mật khẩu mới"
                {...registerChangePassword("newpassword")}
              />
              {errorsChangePassword.newpassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errorsChangePassword.newpassword.message}
                </span>
              )}
              <span
                className="absolute right-3 top-[41px] cursor-pointer"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
            <div className="mb-3 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-md font-medium mb-2"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input w-full px-4 py-2 border rounded-lg ${
                  errorsChangePassword.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                {...registerChangePassword("confirmPassword")}
              />
              {errorsChangePassword.confirmPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errorsChangePassword.confirmPassword.message}
                </span>
              )}
              <span
                className="absolute right-3 top-[41px] cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </span>
            </div>
            <button
              type="submit"
              className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
                errorsChangePassword.newpassword ||
                errorsChangePassword.confirmPassword
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              Đổi mật khẩu
            </button>
          </form>
        ) : null}
      </Modal>
    </>
  );
};

export default LoginPage;
