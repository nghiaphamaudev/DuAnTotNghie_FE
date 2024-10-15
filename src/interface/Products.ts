import { IOption } from "./Option";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  // priceOld: number;
  // size: string[];
  image: string[];
  idSize: string[];
  quantity: number;
  description: string;
  categoryId: string;
  status: number | boolean;
  createdAt: string;
  productSizedata: IProductSizedata[];
  variants: { price: number }[];
  options: IOption[];
}

export interface IProductSizedata {
  price: number;
  quantity: number;
  _id: string;
}
