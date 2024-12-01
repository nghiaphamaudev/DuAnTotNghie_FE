import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from "./../common/types/User";
/* eslint-disable no-useless-catch */
import { AddressRequest } from "../common/types/Address";
import {
  User,
  UserLoginRequest,
  UserRegisterRequest,
} from "../common/types/User";
import instance from "../config/axios";

export const loginAccount = async (payload: UserLoginRequest) => {
  try {
    const { data } = await instance.post("/users/auth/login", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerAccount = async (payload: UserRegisterRequest) => {
  try {
    const { data } = await instance.post("/users/auth/register", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (payload: UpdatePasswordRequest) => {
  try {
    const { data } = await instance.patch(
      "/users/auth/updatePassword",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (payload: ForgotPasswordRequest) => {
  try {
    const { data } = await instance.post("/users/auth/forgotPassword", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  payload: ResetPasswordRequest,
  resetToken: string
) => {
  try {
    const { data } = await instance.patch(
      `/users/auth/resetPassword/${resetToken}`,
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const { data } = await instance.get("/users/getMe");
    return data;
  } catch (error) {
    throw error;
  }
};

export const addAddress = async (payload: AddressRequest) => {
  try {
    const { data } = await instance.post("/users/address", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (payload: User) => {
  try {
    const { data } = await instance.patch("/users/updateMe", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async (payload: AddressRequest) => {
  try {
    const { data } = await instance.patch(
      `/users/address/${payload.id}`,
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateStatusAddress = async (payload: AddressRequest) => {
  try {
    const { data } = await instance.patch(
      `/users/update-status-address/${payload.id}`,
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (payload: { id: string }) => {
  try {
    const { data } = await instance.patch(
      `/users/delete-address/${payload.id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllUser = async () => {
  try {
    const { data } = await instance.get("/users/admin");
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleBlockUser = async (payload: {
  userId: string;
  shouldBlock: boolean;
  note?: string;
}) => {
  try {
    const { data } = await instance.patch(
      `/users/admin/${payload.userId}/toggle-block`, // Endpoint API
      {
        shouldBlock: payload.shouldBlock,
        note: payload.note, // Truyền lý do chặn
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateRoleUser = async (userId: string, role: string) => {
  try {
    const { data } = await instance.patch(
      `/users/admin/${userId}/change-user-role`,
      {
        role, 
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
