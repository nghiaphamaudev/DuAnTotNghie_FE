import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "./zod";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { z } from "zod";

type ChangePasswordFormProps = {
  handleCancel: () => void;
  resetStates: () => void;
  setIsChangePassword: (value: boolean) => void;
};
type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
const ChangePasswordForm = ({
  handleCancel,
  setIsChangePassword,
  resetStates,
}: ChangePasswordFormProps) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });

  const onSubmitChangePassword = (data: ChangePasswordForm) => {
    console.log(data);
    resetStates();
    // Xử lý logic đổi mật khẩu
    setIsChangePassword(false);
    handleCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitChangePassword)}>
      <p className="text-md font-semibold mt-[10px]">
        Vui lòng đổi mật khẩu để đăng nhập lại
      </p>
      <div className="mb-3 relative mt-[20px]">
        <label htmlFor="newpassword" className="block text-md font-medium mb-2">
          Mật khẩu mới
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          className={`form-input w-full px-4 py-2 border rounded-lg ${
            errors.newpassword ? "border-red-500" : "border-gray-300"
          }`}
          id="newpassword"
          placeholder="Nhập mật khẩu mới"
          {...register("newpassword")}
        />
        {errors.newpassword && (
          <span className="text-red-500 text-xs mt-1">
            {errors.newpassword.message}
          </span>
        )}
        <span
          className="absolute right-3 top-[41px] cursor-pointer"
          onClick={() => setShowNewPassword(!showNewPassword)}
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
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          id="confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </span>
        )}
        <span
          className="absolute right-3 top-[41px] cursor-pointer"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </span>
      </div>
      <button
        type="submit"
        className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
          errors.newpassword || errors.confirmPassword
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      >
        Đổi mật khẩu
      </button>
    </form>
  );
};

export default ChangePasswordForm;
