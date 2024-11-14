import instance from "../config/axios";
import { AdđToCartRequest } from "../interface/Cart";

export const getCartForUserServices = async () => {
    const { data } = await instance.get('/cart/get-cart-detail/');
    return data
}

export const addItemToCartServices = async (payload: AdđToCartRequest) => {
    const { data } = await instance.post('/cart/add', payload);
    return data
}

export const deleteItemFromCartServices = async (id: string) => {
    const { data } = await instance.delete(`/cart/${id}`)
    return data
}