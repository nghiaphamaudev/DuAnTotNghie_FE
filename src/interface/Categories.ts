export interface ICategory {
  _id: string;
  loai: string;
  status: string;
  optionList: optionData[];
}

export interface optionData {
  _id: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
}
