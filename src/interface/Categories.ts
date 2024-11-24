export interface ICategory {
  id: string;
  loai: string;
  name: string
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
