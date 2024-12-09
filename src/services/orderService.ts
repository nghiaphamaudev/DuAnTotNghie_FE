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
// lay tat ca don hang
export const getAllOrdersService = async () => {
  try {
    const { data } = await instance.get("/orders/all-order");
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};
// Lấy danh sách đơn hàng theo người dùng
export const getOrdersByUserService = async () => {
  try {
    const { data } = await instance.get("/orders");
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
    const { data } = await instance.get(`/orders/${orderId}`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderService = async (
  orderId: string,
  status: string,
  note?: string
) => {
  try {
    const payload = {
      idOrder: orderId,
      status,
      note
    };
    const { data } = await instance.patch("/orders/update-order", payload);
    console.log("Cập nhật trạng thái đơn hàng thành công: ", data);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Lỗi khi cập nhật trạng thái đơn hàng: ",
        error.response?.data
      );
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};
// service lay tat ca don hang cho admin
export const getAllOrdersServiceForAdmin = async () => {
  try {
    const { data } = await instance.get("/superadmins/all-order");
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};
export const getOrderDetailServiceForAdmin = async (orderId: string) => {
  try {
    const { data } = await instance.get(`/superadmins/bill/${orderId}`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

export const updateOrderServiceForAdmin = async (
  orderId: string,
  status: string,
  note?: string
) => {
  try {
    const payload = {
      idOrder: orderId,
      status,
      note
    };
    const { data } = await instance.patch(
      "/superadmins/update-order-admin",
      payload
    );
    console.log("Cập nhật trạng thái đơn hàng thành công: ", data);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Lỗi khi cập nhật trạng thái đơn hàng: ",
        error.response?.data
      );
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};
