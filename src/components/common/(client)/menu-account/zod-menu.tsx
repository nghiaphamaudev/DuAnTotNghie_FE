import { z } from "zod";

export const UserProfileSchema = z.object({
  gender: z.enum(["Nam", "Nữ", "Khác"], {
    required_error: "Vui lòng chọn giới tính",
  }),
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
});
