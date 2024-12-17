import { createContext, useContext, useEffect, useState } from "react";
import { getAllProduct, getProductById } from "../services/productServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Products } from "../common/types/Product";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/index";

type ProductContextProps = {
  allProduct: Products[];
  product: Products | null;
  getDataProductById: (id: string) => void;
};

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

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
  const [product, setProduct] = useState<Products | null>(null);
  const queryClient = useQueryClient();
  const nav = useNavigate();

  const { data: allProduct = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await getAllProduct();
      return data;
    }
    // refetchOnWindowFocus: false // Tùy chọn cải thiện hiệu năng nếu không cần refetch khi focus
  });

  const { mutateAsync: getDataProductById } = useMutation({
    mutationFn: async (id: string) => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        return data;
      } catch (error) {
        nav("*");
      }
    }
  });

  useEffect(() => {
    const handleHiddenProduct = () => {
      console.log("Hidden product event detected, refetching...");
      queryClient.invalidateQueries(["products"]);
    };

    socket.on("hidden product", handleHiddenProduct);

    return () => {
      socket.off("hidden product", handleHiddenProduct);
    };
  }, [queryClient]);

  return (
    <ProductContext.Provider
      value={{
        allProduct,
        product,
        getDataProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
