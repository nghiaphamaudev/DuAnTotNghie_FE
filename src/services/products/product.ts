import axiosInstance from "../../config/axios";
import { IProduct } from "../../interface/Products";

// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`/products`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Lấy một sản phẩm theo ID
export const getOneProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Thêm sản phẩm mới
export const addProduct = async (product: IProduct) => {
  try {
    const { data } = await axiosInstance.post("/products/add", product);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Xóa sản phẩm
export const deleteProduct = async (product: IProduct) => {
  try {
    const { data } = await axiosInstance.delete(`/products/${product._id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (product: IProduct) => {
  try {
    const { data } = await axiosInstance.put(
      `/products/${product._id}`,
      product
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
