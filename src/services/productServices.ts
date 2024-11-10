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
export const addItemToCart = async (productId, variantId, sizeId, quantity) => {
    try {
        const response = await instance.post(
            '/cart/add',
            { productId, variantId, sizeId, quantity },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to add item to cart:", error.response?.data || error.message);
        throw error;
    }
};
