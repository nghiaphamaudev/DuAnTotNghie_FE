
export type User = {
  image: any;
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

export type GetMeAdmin = {
  _id: string;
  fullName: string;
  email: string;
  active: boolean;
  password: string;
  role: string;
  coverImg: string;
  createdAt: string;
  __v: number;
};

export type UpdateUser = {
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  active: boolean;
  _id: string;
  id: string;
  gender: boolean;
  image: string
};

export type UserResponse = {
  accessToken: string;
  data: User;
  adminToken: string
  avatar: string;
  user: string // Thông tin người dùng
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

export type RegisterAdminRequest = {
  email: string;
  password: string;
  fullName?: string;
  role:string
};

export type UpdatePasswordRequest = {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

export type UpdatePasswordRequestAdmin = {
  resetPassword: string;
  resetPasswordConfirm: string;
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

export type UserAdmin = {
  _id:string
  idAdmin:string;
  key: string;
  id: string;
  email: string;
  fullName: string;
  role: 'superadmin' | 'admin' | 'user';
  createdAt: string;
  active: boolean;
  
};


