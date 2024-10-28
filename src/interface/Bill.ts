export interface IBill {
  _id: string;
  userId: string;
  code: string;
  products: IProductBill[];
  totalPrice: number;
  status: string;
  customerName: string;
  address: string;
  phone: string;
  message: string;
  paymentMethod: string;
  shippingCost: number;
  discouVoucher: number;
  statusShip: boolean;
  createdAt: string;
}

export interface IProductBill {
  id_: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  variantId: string;
  optionId: string;
  optionName: string;
  optionPrice: number;
}
