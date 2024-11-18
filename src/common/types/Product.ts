// Định nghĩa type cho kích thước sản phẩm (size)
export type ProductSize = {
  _id: string; // ID của kích thước
  nameSize: string; // Tên kích thước (M, L, XL, v.v.)
  price: number; // Giá tương ứng với kích thước
  inventory: number; // Số lượng sản phẩm còn lại trong kho
  id: string; // Một ID nữa (có thể giống _id hoặc khác nếu schema yêu cầu)
};

// Định nghĩa type cho biến thể sản phẩm (variant)
export type ProductVariant = {
  _id: string; // ID của biến thể sản phẩm
  color: string; // Màu sắc của sản phẩm
  images: string[]; // Danh sách các ảnh cho biến thể này
  sizes: ProductSize[]; // Danh sách các kích thước khả dụng
  id: string; // Một ID nữa (có thể giống _id hoặc khác)
};

// Định nghĩa type cho sản phẩm chính (product)
export type Product = {
  data: any;
  id: string; // ID của sản phẩm
  name: string; // Tên sản phẩm
  description: string; // Mô tả sản phẩm
  coverImg: string; // Ảnh bìa chính của sản phẩm
  variants: ProductVariant[]; // Các biến thể của sản phẩm (màu sắc, kích thước)
  discount?: number; // Tùy chọn: giảm giá cho sản phẩm (nếu có)
  colorsAvailable: number; // Số lượng màu sắc có sẵn
  sizesAvailable: number; // Số lượng kích thước có sẵn
  category: string; // Danh mục sản phẩm (liên kết với ID danh mục)
  ratingAverage: number; // Điểm đánh giá trung bình của sản phẩm
  ratingQuantity: number; // Số lượng đánh giá của sản phẩm
  status: string; // Trạng thái sản phẩm (Ví dụ: "Available", "Out of stock")
};
