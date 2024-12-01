export type IVoucher = {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "amount";
  discountPercentage?: number;
  discountAmount?: number;
  startDate: string;
  expirationDate: string;
  quantity: number;
  usedCount: number;
  status: "active" | "inactive";
  minPurchaseAmount: number;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface Coupon {
  code: string;
  discountAmount: number;
  startDate: string;
  expirationDate: string;
  minPurchaseAmount: number;
}

export type CreateVoucherPayload = Omit<
  IVoucher,
  "_id" | "createdAt" | "updatedAt" | "__v" | "usedCount"
>;

export type UpdateVoucherPayload = Partial<CreateVoucherPayload>;
