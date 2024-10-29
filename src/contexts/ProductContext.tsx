import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProduct, getProductById } from "../services/productServices";
import { useMutation } from "@tanstack/react-query";
import { Product } from "../common/types/Product";

type ProductContextProps = {
  allProduct: Product[];
  product: Product | null;
  setAllProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  getAllDataProduct: () => void;
  getDataProductById: (id: string) => void;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <ProductContext.Provider
      value={{
        allProduct,
        product,
        setAllProduct,
        getAllDataProduct,
        getDataProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
