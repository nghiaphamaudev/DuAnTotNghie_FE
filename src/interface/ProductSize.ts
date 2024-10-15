export interface IProductSize {
  _id: string | null;
  idProduct: string;
  idSize: string;
  quantity: number;
  sizeName?: string;
  status: number | boolean;
  price: number;
}
