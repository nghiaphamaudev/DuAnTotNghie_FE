export interface IAddress {
    _id: string | null;
    idUser: string | null;
    fullName: string;
    phoneNumber: string;
    provinceId: number;
    provinceName: string;
    districtId: number;
    districtName: string;
    wardId: number;
    wardName: string;
    specifically: string;
    isDefault: boolean;
  }
  
  export interface IPronvince {
    ProvinceID: number;
    ProvinceName: string;
  }
  
  export interface IDistrict {
    DistrictID: number;
    provinceId: number;
    DistrictName: string;
  }
  
  export interface IWard {
    DistrictID: number;
    WardCode: string;
    WardName: string;
  }
  