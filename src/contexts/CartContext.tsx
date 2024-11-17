import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { addItemToCartServices, deleteItemFromCartServices, getCartForUserServices } from "../services/cartServices";
import { useAuth } from "./AuthContext";
import { AdđToCartRequest, Cart } from "../interface/Cart";
import { ResponseData } from "../interface/http";

type CartContextProps = {
    cartData: Cart | null,
    setCartData: React.Dispatch<React.SetStateAction<Cart | null>>,
    deleteItemCart: (id: string) => void,
    addItemToCart: (payload: AdđToCartRequest) => Promise<ResponseData>
};

const CartContext = createContext({} as CartContextProps);
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within an AuthProvider");
    }
    return context;
};

export const CartProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [cartData, setCartData] = useState<Cart | null>(null);
    const { token } = useAuth();

    const queryClient = useQueryClient();

    // lấy dữ liệu cart người dùng
    useQuery({
        queryKey: ["carts"],
        queryFn: async () => {
            const res = await getCartForUserServices()
            setCartData(res.data)
            return res.data
        },
        enabled: !!token
    })

    useEffect(() => {
        if (!token) {
            setCartData(null);
        }
    }, [token])

    // thêm sản phẩm vào cart
    const { mutateAsync: addItemToCart } = useMutation({
        mutationFn: async (payload: AdđToCartRequest) => {
            const res = await addItemToCartServices(payload);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["carts"],
            });
        },
    });

    // xóa item trong cart
    const { mutateAsync: deleteItemCart } = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteItemFromCartServices(id);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["carts"],
            });
        },
    });


    return (
        <CartContext.Provider
            value={{
                setCartData,
                cartData,
                deleteItemCart,
                addItemToCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
