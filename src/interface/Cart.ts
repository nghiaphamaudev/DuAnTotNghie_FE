// Yêu cầu thêm sản phẩm vào giỏ hàng
export interface AddToCartRequest {
  productId: string; // ID sản phẩm
  variantId: string; // ID biến thể (màu sắc hoặc kiểu dáng)
  sizeId: string; // ID kích thước
  quantity: number; // Số lượng sản phẩm
}

// Yêu cầu cập nhật số lượng sản phẩm trong giỏ hàng
export interface UpdateQuantityCartRequest {
  cartItemId: string; // ID của sản phẩm trong giỏ hàng
  option: string; // Tùy chọn tăng hoặc giảm số lượng
}

// Thông tin của từng sản phẩm trong giỏ hàng
export interface CartItem {
  id: string; // ID mục giỏ hàng
  productId: string; // ID sản phẩm
  name: string; // Tên sản phẩm
  color: string; // Màu sắc của sản phẩm
  images: string; // URL hình ảnh sản phẩm
  size: string; // Kích thước sản phẩm
  price: number; // Giá của sản phẩm
  quantity: number; // Số lượng sản phẩm
  totalItemPrice: number; // Tổng giá trị của sản phẩm (giá * số lượng)
  variantId: string; // ID biến thể sản phẩm
  sizeId: string; // ID kích thước sản phẩm
}

// Thông tin toàn bộ giỏ hàng
export interface Cart {
  user: string; // ID người dùng sở hữu giỏ hàng
  items: CartItem[]; // Danh sách các mục trong giỏ hàng
  totalCartPrice: number; // Tổng giá trị của toàn bộ giỏ hàng
}
