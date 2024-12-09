import { createContext, useContext, useState } from "react";
import { getAllProduct, getProductById } from "../services/productServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Products } from "../common/types/Product";
import { useNavigate } from "react-router-dom";

type ProductContextProps = {
  allProduct: Products[];
  product: Products | null;
  setAllProduct: React.Dispatch<React.SetStateAction<Products[]>>;
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

  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await getAllProduct();
      setAllProduct(data.data);
      return data.data;
    },
  });



  const { mutateAsync: getDataProductById } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        return data;
      } catch (error) {
        nav('*')
      }
    }
  });




  return (
    <ProductContext.Provider
      value={{
        allProduct,
        product,
        setAllProduct,
        getDataProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
