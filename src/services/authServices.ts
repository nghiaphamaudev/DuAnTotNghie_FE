/* eslint-disable no-useless-catch */
import { AddressRequest } from "../common/types/Address";
import {User, UserLoginRequest, UserRegisterRequest } from "../common/types/User";
import instance from "../config/axios";

export const loginAccount = async (payload: UserLoginRequest) => {
    try {
        const { data } = await instance.post('/users/auth/login', payload);
        return data
    } catch (error) {
        throw error
    }
}

export const registerAccount = async (payload: UserRegisterRequest) => {
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

export const addAddress = async (payload: AddressRequest) => {
    try {
        const { data } = await instance.post('/users/address', payload);
        return data
    } catch (error) {
        throw error
    }
}

export const updateProfile= async (payload: User) => {
    try {
        const { data } = await instance.patch('/users/updateMe', payload);
        return data
    } catch (error) {
        throw error
    }
}

export const updateAddress= async (payload: AddressRequest) => {
    try {
        const { data } = await instance.patch(`/users/address/${payload.id}`, payload);
        return data
    } catch (error) {
        throw error
    }
}

export const deleteAddress= async (payload:{ id: string }) => {
    try {
        const { data } = await instance.patch(`/users/delete-address/${payload.id}`);
        return data
    } catch (error) {
        throw error
    }
}

export const uploadImage = async (formData: FormData) => {
    const { data } = await instance.post('/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }