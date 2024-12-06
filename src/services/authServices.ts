import { updatePassword } from "./authServices";
import {
  ForgotPasswordRequest,
  RegisterAdminRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UpdatePasswordRequestAdmin,
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
    const { data } = await instance.patch("/users/updateMe", payload, {
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo header là multipart
      },
    });
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

export const getAllUserAccounts = async () => {
  try {
    const { data } = await instance.get("/superadmins/users");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSuperAndAdmin = async () => {
  try {
    const { data } = await instance.get("/superadmins/manage-account");
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginAdmin = async (payload: UserLoginRequest) => {
  try {
    const { data } = await instance.post("/superadmins/login", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleBlockUser = async (payload: {
  idUser: string;
  status: boolean;
  note?: string;
}) => {
  try {
    const { data } = await instance.patch(
      `/superadmins/blocked-account-user/${payload.idUser}`,
      {
        status: payload.status,
        note: payload.note,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleBlockAdmin = async (payload: {
  idAdmin: string;
  status: boolean;
}) => {
  try {
    const { data } = await instance.patch(
      `/superadmins/blocked-account/${payload.idAdmin}`,
      {
        status: payload.status, // Đảm bảo status được gửi đúng (false trong trường hợp này)
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerAdmin = async (payload: RegisterAdminRequest) => {
  try {
    const { data } = await instance.post(
      "/superadmins/create-account",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePasswordAdminAnhSuperAdmin = async (
  payload: UpdatePasswordRequestAdmin
) => {
  try {
    const { data } = await instance.patch(
      "/superadmins/update-password",
      payload
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMeAdmin = async () => {
  try {
    const { data } = await instance.get("/superadmins/get-me");
    return data;
  } catch (error) {
    throw error;
  }
};

export const updatePasswordAdmin = async (payload: {
  idAdmin: string;
  assignedRole: string;
  resetPassword: string;
}) => {
  try {
    const { data } = await instance.patch(
      `/superadmins/update-infor-admin/${payload.idAdmin}`,
      payload
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
