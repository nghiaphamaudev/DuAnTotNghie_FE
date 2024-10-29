export interface ITransaction {
  _id: string | null;
  idUser: string;
  idBill: string;
  transCode: string;
  type: boolean;
  totalMoney: number;
  note: string;
  status: boolean;
  createdAt: string;
}
