import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, getAllProduct, getProductById } from "../services/productServices";
import { useMutation } from "@tanstack/react-query";
import { Product } from "../common/types/Product";
import { message } from "antd";

type ProductContextProps = {
  allProduct: Product[];
  product: Product | null;
  setAllProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  getAllDataProduct: () => void;
  getDataProductById: (id: string) => void;
  addItemToCartHandler: (productData: { productId: string, variantId: string, sizeId: string, quantity: number }) => void;
};

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const nav = useNavigate();
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const { mutateAsync: getAllDataProduct } = useMutation({
    mutationFn: async () => {
      const data = await getAllProduct();
      setAllProduct(data.data);
      return data;
    }
  });

  const { mutateAsync: getDataProductById } = useMutation({
    mutationFn: async (id: string) => {
      const data = await getProductById(id);
      setProduct(data);
      return data;
    }
  });

  const { mutateAsync: addItemToCartHandler } = useMutation({
    mutationFn: async (productData: { productId: string, variantId: string, sizeId: string, quantity: number }) => {
      try {
        const response = await addItemToCart(productData);
        console.log(response);
  
        if (response.status === "success") {
          message.success("Sản phẩm đã được thêm vào giỏ hàng thành công!");
          return response;
        } else if (response.status === "unauthorized") {
          message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
          throw new Error("Chưa đăng nhập.");
        } else {
          throw new Error("Đã xảy ra lỗi.");
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Lỗi thêm sản phẩm vào giỏ hàng.";
        message.error(errorMessage);
        throw error; 
      }
    },
  });
  
  

  return (
    <ProductContext.Provider
    value={{
      allProduct,
      product,
      setAllProduct,
      getAllDataProduct,
      getDataProductById,
      addItemToCartHandler,
    }}
  >
    {children}
  </ProductContext.Provider>
  );
};
