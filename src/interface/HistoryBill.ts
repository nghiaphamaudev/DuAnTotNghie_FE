export interface IHistoryBill {
  _id: string | null;
  idUser: string;
  idBill: string;
  creator: string;
  role: string;
  statusBill: string;
  note: string;
  createdAt: string | null;
}
