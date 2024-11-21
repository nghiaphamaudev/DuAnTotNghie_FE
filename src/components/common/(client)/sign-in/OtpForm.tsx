import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpSchema } from "./zod";
import { z } from "zod";

type OtpFormProps = {
  email: string;
  setIsOTPVerified: (value: boolean) => void;
  setIsChangePassword: (value: boolean) => void;
};

type OtpForm = z.infer<typeof OtpSchema>;

const OtpForm = ({
  email,
  setIsOTPVerified,
  setIsChangePassword,
}: OtpFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(OtpSchema),
    mode: "onBlur",
  });

  const onSubmitOTP = (data: OtpForm) => {
    console.log(data);
    // Logic to verify OTP
    setIsOTPVerified(true);
    setIsChangePassword(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitOTP)}>
      <p className="text-md font-semibold mt-[10px]">
        Mã OTP đã được gửi tới email: <strong>{email}</strong>
      </p>
      <input
        type="text"
        className={`form-input mt-[20px] w-full px-4 py-2 border rounded-lg ${
          errors.otp ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Nhập mã OTP"
        {...register("otp")}
      />
      {errors.otp && (
        <span className="text-red-500 text-xs mt-1">{errors.otp.message}</span>
      )}
      <button
        type="submit"
        className={`mt-4 w-full py-2 px-4 text-white rounded-lg ${
          errors.otp ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        Xác nhận OTP
      </button>
    </form>
  );
};

export default OtpForm;
