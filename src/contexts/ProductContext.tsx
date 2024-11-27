import { createContext, useContext, useState } from "react";
import { getAllProduct, getProductById } from "../services/productServices";
import { useMutation } from "@tanstack/react-query";
import { Products } from "../common/types/Product";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

type ProductContextProps = {
  allProduct: Products[];
  product: Products | null;
  setAllProduct: React.Dispatch<React.SetStateAction<Products[]>>;
  getAllDataProduct: () => void;
  getDataProductById: (id: string) => void
};

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
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
  const [allProduct, setAllProduct] = useState<Products[]>([]);
  const [product, setProduct] = useState<Products | null>(null);

  const { mutateAsync: getAllDataProduct } = useMutation({
    mutationFn: async () => {
      const params = {
        page: 1,
        limit: 5,
        name: "",
        status: 1,
      };
      const data = await getAllProduct(params);
      setAllProduct(data.data);
      return data;
    },
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
