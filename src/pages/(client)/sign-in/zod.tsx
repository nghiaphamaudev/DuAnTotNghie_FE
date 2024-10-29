import { z } from "zod";

export const LoginSchema = z.object({
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
export const ForgotPasswordSchema = z.object({
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
export const OtpSchema = z.object({
  otp: z
    .string()
    .nonempty("Vui lòng nhập mã OTP")
    .length(6, "Mã OTP bao gồm 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ được chứa các chữ số"),
});

//validate đổi mk
export const ChangePasswordSchema = z
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

export const RegisterSchema = z
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
      .regex(/[A-Z]/, "Mật khẩu ít nhất pOhải có một chữ hoa")
      .regex(/[\d]/, "Mật khẩu ít nhất phải có một số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu ít nhất phải có một ký tự đặc biệt"),
    fullName: z
      .string()
      .nonempty("Vui lòng nhập tên người dùng")
      .min(7, "Tên người dùng phải dài hơn 7 kí tự "),
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
