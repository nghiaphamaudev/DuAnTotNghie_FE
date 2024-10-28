import instance from "../config/axios";

export const loginAccount = async (payload: any) => {
    try {
        const { data } = await instance.post('/users/auth/login', payload);
        return data
    } catch (error) {
        throw error
    }
}

export const registerAccount = async (payload: any) => {
    try {
        const { data } = await instance.post('/users/auth/register', payload);
        return data
    } catch (error) {
        throw error
    }
}