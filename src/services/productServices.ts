import { DeleteProduct, Products } from "../common/types/Product";
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

const token = localStorage.getItem('accessToken');


export const getProductById = async (id: string) => {
    try {
        const { data } = await instance.get('/products/' + id);
        return data
    } catch (error) {
        throw error
    }
}
export const addProduct = async (product: Products) => {
    try {

        const response = await instance.post('/products', product);
        return response.data;
    } catch (error: any) {
        console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
        throw error;
    }
};
export const deleteProductStatus = async (id: string, isActive: boolean) => {
    try {
        console.log(token);
        const response = await instance.patch(`/products/${id}/status`, { isActive }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token ? token : ''
            }
        });
        console.log('API response:', response.data);
        if (!response.data || !response.data.data || !response.data.data.id) {
            throw new Error('Product ID is invalid');
        }

        return response.data;
    } catch (error) {
        console.error('Error updating product status:', error);
        throw error;
    }
};

export const updateProduct = async (id: string, formData: FormData) => {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/products/${id}`, {
        method: 'PUT',
        body: formData,
    });
    const responseBody = await response.json();
    console.log('Response body:', responseBody);
    return responseBody;
};




