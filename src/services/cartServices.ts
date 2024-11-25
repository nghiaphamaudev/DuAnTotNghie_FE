import axios from "axios";
import instance from "../config/axios";
import { AdđToCartRequest, UpdateQuantityCartRequest } from "../interface/Cart";

export const getCartForUserServices = async () => {
  try {
    const { data } = await instance.get("/cart/get-cart-detail/");
    console.log("GET-CART-DETAIL: ", data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

export const addItemToCartServices = async (payload: AdđToCartRequest) => {
  try {
    const { data } = await instance.post("/cart/add", payload);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

export const deleteItemFromCartServices = async (id: string) => {
  try {
    const { data } = await instance.delete(`/cart/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};

export const updateQuantityItemCartServices = async (
  payload: UpdateQuantityCartRequest
) => {
  try {
    const { data } = await instance.patch(
      "/cart/change-quantity-cart",
      payload
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      throw new Error("Something went wrong!");
    }
  }
};
