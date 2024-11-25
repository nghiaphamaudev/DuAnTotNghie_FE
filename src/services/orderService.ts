import axios from "axios";
import instance from "../config/axios";
import { CheckoutFormData } from "../interface/Order";

// Gửi yêu cầu tạo đơn hàng (Checkout)
export const createOrderService = async (payload: CheckoutFormData) => {
  try {
    const { data } = await instance.post("/orders", payload);
    console.log("order data: ", data);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

// Khởi tạo thanh toán VNPay
export const initiateVNPayPayment = async (payload: CheckoutFormData) => {
  try {
    const { data } = await instance.post("/orders", payload);
    console.log("VNPay payment data: ", data);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("error: ", error.response?.data);
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

// Lấy danh sách đơn hàng theo người dùng
export const getOrdersByUserService = async () => {
  try {
    const { data } = await instance.get("/order/user-orders");
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderDetailService = async (orderId: string) => {
  try {
    const { data } = await instance.get(`/order/${orderId}`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};
