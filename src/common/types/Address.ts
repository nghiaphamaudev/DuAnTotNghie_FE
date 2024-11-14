export type AddressRequest = {
  id: string
  nameReceiver: string; // Tên người nhận
  phoneNumberReceiver: string; // Số điện thoại người nhận
  addressReceiver: {
    province: {
      provinceName: any;
      code: string; // Mã tỉnh/thành phố 
    };
    district: {
      districtName: any;
      code: string; // Mã quận/huyện
    };
    ward: {
      wardName: any;
      code: string; // Mã phường/xã
    };
  };
  detailAddressReceiver?: string; // Địa chỉ chi tiết
  isDefault?: boolean; // Địa chỉ mặc định hay không
};


export type AddressResponse = {
  success: string; // Trạng thái thành công
  message: string; // Thông điệp phản hồi
  data?: AddressRequest; // Dữ liệu địa chỉ vừa thêm (nếu có)
};



export type Province = {
  code: string;
  name: string;
};

export type District = {
  code: string;
  name: string;
};

export type Ward = {
  code: string;
  name: string;
};
