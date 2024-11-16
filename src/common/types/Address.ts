export type AddressRequest = {
  id?: string
  nameReceiver: string; // Tên người nhận
  phoneNumberReceiver: string; // Số điện thoại người nhận
  addressReceiver: {
    province: {
      name: string;
      code: string;
    };
    district: {
      name: string;
      code: string;
    };
    ward: {
      name: string;
      code: string;
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
