import instance from "../config/axios";

export const getAllCategory = async () => {
    try {
        const { data } = await instance.get('/categories');
        return data
    } catch (error) {
        throw error
    }
}

export const addCategory = async (payload: any) => {
    try {
        const { data } = await instance.post('/categories', payload);
        return data
    } catch (error) {
        throw error
    }
}


export const getCategoryById = async (id: string) => {
    try {
        const { data } = await instance.get(`/categories/${id}`);
        console.log("Category data fetched successfully:", data);

        return data;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};
