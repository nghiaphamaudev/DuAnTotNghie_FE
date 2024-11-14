/* eslint-disable no-useless-catch */
import instance from "../config/axios";

export const getAllProduct = async () => {
    try {
        const { data } = await instance.get('/products');
        return data
    } catch (error) {
        throw error
    }
}

export const getProductById = async (id: string) => {
    try {
        const { data } = await instance.get('/products/' + id);
        return data
    } catch (error) { 
        throw error
    }
}