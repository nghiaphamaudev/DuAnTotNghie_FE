import instance from "../config/axios";
import { IVoucher } from "../interface/Voucher";

// Lấy danh sách tất cả vouchers
export const getVouchers = async (): Promise<IVoucher[]> => {
  try {
    const response = await instance.get("/vouchers");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vouchers:", error);
    throw error;
  }
};
