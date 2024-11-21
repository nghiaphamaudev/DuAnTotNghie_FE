// Định nghĩa type cho kích thước sản phẩm (size)
export type ProductSize = {
  _id: string; // ID của kích thước
  nameSize: string; // Tên kích thước (M, L, XL, v.v.)
  price: number; // Giá tương ứng với kích thước
  inventory: number; // Số lượng sản phẩm còn lại trong kho
  id: string; // Một ID nữa (có thể giống _id hoặc khác nếu schema yêu cầu)
  status?: boolean
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
export type Products = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  variants: ProductVariant[];
  discount?: number;
  category: string;
  ratingAverage: number;
  ratingQuantity: number;
  isActive: boolean;
};

export type ProductResponse = {
  data: Products[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type ProductsResponse = {
  data: Products[];
  pagination: {
    currentPage: number;
    totalItems: number;
  };
}

export type DeleteProduct = {
  id: string;
  status: boolean;
}

