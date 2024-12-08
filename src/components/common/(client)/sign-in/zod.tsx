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
    .min(6, "Mật khẩu phải lớn hơn 6 kí tự ")
    .regex(/[a-z]/, "Mật khẩu ít nhất phải có một chữ thường")
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
      .min(6, "Mật khẩu phải lớn hơn 6 kí tự ")
      .regex(/[a-z]/, "Mật khẩu ít nhất phải có một chữ thường")
      .regex(/[\d]/, "Mật khẩu ít nhất phải có một số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu ít nhất phải có một ký tự đặc biệt"),
    fullName: z
      .string()
      .nonempty("Vui lòng nhập tên người dùng")
      .min(7, "Tên người dùng phải dài hơn 7 kí tự ")
      .max(50, "Tên người dùng không được vượt quá 50 kí tự"),
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
