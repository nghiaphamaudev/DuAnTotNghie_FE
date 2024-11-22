import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "./zod";
import { z } from "zod";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";

type ForgotPasswordFormProps = {
  setEmail: (email: string) => void;
  setIsEmailVerified: (value: boolean) => void;
};

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordForm = ({
  setEmail,
  setIsEmailVerified,
}: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onBlur",
  });
  const { forgotMyPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const onSubmitEmail = async (data: ForgotPasswordForm) => {
    setLoading(true);
    await forgotMyPassword(data);
    setEmail(data.email);
    setIsEmailVerified(true);
    reset();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitEmail)} className="mt-[20px]">
      <p className="text-md font-semibold mt-[10px]">
        Vui lòng nhập địa chỉ email đã đăng ký của bạn thông báo đổi mật khẩu từ
        chúng tôi.
      </p>
      <input
        type="text"
        className={`form-input mt-[20px] w-full px-4 py-2 border rounded-lg ${
          errors.email ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Nhập email"
        {...register("email")}
      />
      {errors.email && (
        <span className="text-red-500 text-xs mt-1">
          {errors.email.message}
        </span>
      )}
      <button
        type="submit"
        className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
          errors.email ? "bg-red-500" : "bg-blue-500"
        }`}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Xác nhận"}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
