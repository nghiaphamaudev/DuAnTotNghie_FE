// Định nghĩa trạng thái của đơn hàng
export type OrderStatus =
  | "Đơn Hàng Đã Đặt"
  | "Đã Xác Nhận Thông Tin Thanh Toán"
  | "Đã Giao Cho ĐVVC"
  | "Đã Nhận Được Hàng"
  | "Đánh Giá";

// Thông tin sản phẩm trong đơn hàng
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  imageUrl: string;
}

// Thông tin đơn hàng
export interface OrderDetail {
  orderId: string;
  status: OrderStatus;
  timeline: {
    time: string;
    description: string;
  }[];
  deliveryDate: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  shippingProvider: {
    name: string;
    trackingCode: string;
  };
  products: Product[];
  totalPrice: number;
}

export interface CheckoutFormData {
  orderItems: {
    productId: string;
    variantId: string;
    sizeId: string;
    quantity: number;
    price: number;
  }[];
  receiver: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  discountCode?: string;
  discountVoucher?: number;
  shippingCost: number;
}
