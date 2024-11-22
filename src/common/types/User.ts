
export type User = {
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  role: string;
  rank: string;
  active: boolean;
  _id: string;
  addresses: any[];
  favoriteProduct: any[];
  createdAt: string;
  updatedAt: string;
  id: string;
  gender: boolean;
  birthday: Date;
};
export type UserResponse = {
  accessToken: string;
  data: User; // Thông tin người dùng
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type UserRegisterRequest = {
  email: string;
  password: string;
  phoneNumber?: string;
  confirmPassword?: string;
  fullName?: string;
};

export type UpdatePasswordRequest = {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

export type ResetPasswordRequest = {
  password: string;
  passwordConfirm: string;
}


export type ForgotPasswordRequest = {
  email: string;
}
export type ApiError = {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}



