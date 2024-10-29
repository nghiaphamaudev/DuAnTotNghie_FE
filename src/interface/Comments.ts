export interface IComment {
  _id: string | null;
  idUser: string;
  fullName: string;
  avatar: string;
  idProduct: string;
  productName: string;
  idProductSize: string;
  sizeName: string;
  comment: string;
  rate: number;
  createdAt: string;
}
