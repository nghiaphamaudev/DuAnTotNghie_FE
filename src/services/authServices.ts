import { User, UserRequest } from "../common/types/User";
import instance from "../config/axios";

export const loginAccount = async (payload: UserRequest) => {
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

export const getProfile = async () => {
    try {
        const { data } = await instance.get('/users/getMe');
        return data
    } catch (error) {
        throw error
    }
}

export const addAddress = async (payload: any) => {
    try {
        const { data } = await instance.post('/users/address', payload);
        return data
    } catch (error) {
        throw error
    }
}