import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItemToCart, getAllProduct, getProductById } from "../services/productServices";
import { useMutation } from "@tanstack/react-query";
import { Product } from "../common/types/Product";
import { message } from "antd";  // Đảm bảo bạn đã import message từ Ant Design

type ProductContextProps = {
  allProduct: Product[];
  product: Product | null;
  setAllProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  getAllDataProduct: () => void;
  getDataProductById: (id: string) => void;
  addItemToCartHandler: (productData: { productId: string, variantId: string, sizeId: string, quantity: number }) => void;
};

const ProductContext = createContext({} as ProductContextProps);

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within an AuthProvider");
  }
  return context;
};

export const ProductProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
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
      const { productId, variantId, sizeId, quantity } = productData;
      console.log("Adding to cart:", { productId, variantId, sizeId, quantity });
      try {
        const response = await addItemToCart(productId, variantId, sizeId, quantity);
        if (response.status === 200) {
          message.success("Sản phẩm đã được thêm vào giỏ hàng.");
        } else {
          throw new Error(response.data.message || "Không thể thêm sản phẩm vào giỏ hàng.");
        }
      } catch (error) {
        message.error(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể thêm sản phẩm vào giỏ hàng.'}`);
        console.error("Error adding product to cart:", error);
      }
    }
  });
  
  return (
    <ProductContext.Provider
      value={{
        allProduct,
        product,
        setAllProduct,
        getAllDataProduct,
        getDataProductById,
        addItemToCartHandler
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
