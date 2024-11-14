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
};
export type UserResponse = {
  accessToken: string;
  data: User; // Thông tin người dùng
};

export type UserRequest = {
  email: string;
  password: string;
}
export type Address = {
  address?: string;
  name: string;
  phone: string;
  city?: string;
  district?: string;
  ward?: string;
  detailedAddress?: string;
  addressType?: string;
  defaultAddress?: boolean;
};

export type Province = {
  code: string;
  name: string;
};

export type District = {
  code: string;
  name: string;
};

export type Ward = {
  code: string;
  name: string;
};
