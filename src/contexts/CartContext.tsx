import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import {
  addItemToCartServices,
  deleteItemFromCartServices,
  getCartForUserServices,
  updateQuantityItemCartServices
} from "../services/cartServices";
import { useAuth } from "./AuthContext";
import {
  AddToCartRequest,
  Cart,
  UpdateQuantityCartRequest
} from "../interface/Cart";
import { ResponseData } from "../interface/http";

type CartContextProps = {
  cartData: Cart | null;
  setCartData: React.Dispatch<React.SetStateAction<Cart | null>>;
  setCountItemCart: React.Dispatch<React.SetStateAction<number>>;
  deleteItemCart: (id: string) => void;
  addItemToCart: (payload: AddToCartRequest) => Promise<ResponseData>;
  countItemCart: number;
  updateQuantityItem: (
    payload: UpdateQuantityCartRequest
  ) => Promise<ResponseData>;
};

const CartContext = createContext({} as CartContextProps);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [countItemCart, setCountItemCart] = useState<number>(0);
  const { token } = useAuth();

  const queryClient = useQueryClient();

  // Fetch cart data for user
  const { data, isSuccess } = useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const res = await getCartForUserServices();
      return res.data;
    },
    enabled: !!token
  });

  useEffect(() => {
    if (!token) {
      setCartData(null);
      setCountItemCart(0);
    } else if (isSuccess) {
      setCartData(data);
      setCountItemCart(data?.items?.length);
    }
  }, [token, data, isSuccess]);

  // Add item to cart
  const { mutateAsync: addItemToCart } = useMutation({
    mutationFn: async (payload: AddToCartRequest) => {
      const res = await addItemToCartServices(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["carts"]);
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error);
    }
  });

  // Delete item from cart
  const { mutateAsync: deleteItemCart } = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteItemFromCartServices(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["carts"]);
    },
    onError: (error) => {
      console.error("Error deleting item from cart:", error);
    }
  });

  // Update item quantity in cart
  const { mutateAsync: updateQuantityItem } = useMutation({
    mutationFn: async (payload: UpdateQuantityCartRequest) => {
      const res = await updateQuantityItemCartServices(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["carts"]);
    },
    onError: (error) => {
      console.error("Error updating item quantity:", error);
    }
  });

  return (
    <CartContext.Provider
      value={{
        setCountItemCart,
        setCartData,
        cartData,
        deleteItemCart,
        addItemToCart,
        countItemCart,
        updateQuantityItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
