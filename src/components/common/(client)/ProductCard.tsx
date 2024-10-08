import { Eye, ShoppingBag } from "lucide-react"; // Import icon từ lucide-react
import { useState } from "react";

const ProductCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[250px] border rounded-lg overflow-hidden shadow-lg relative p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Giảm giá */}
      <div className="absolute z-10 top-2 right-2 bg-red-500 text-white text-[14px] font-semibold rounded-full px-2 py-1">
        -30%
      </div>

      {/* Hình ảnh sản phẩm */}
      <div className="relative">
        <img
          className="w-full object-cover h-[250px] mb-4"
          src="https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg"
          alt="Áo T-Shirt Trơn"
        />

        {/* Nút Thêm Giỏ Hàng và Xem chỉ hiển thị khi hover */}
        {isHovered && (
          <div className="absolute inset-0 flex justify-center items-end  mb-5 space-x-4">
            <button className="bg-white p-2 rounded-full shadow-md flex justify-start items-center gap-1">
              <ShoppingBag size={20} className="text-gray-800" />{" "}
              {/* Icon giỏ hàng */}
              <span className="text-sm">Thêm giỏ hàng</span>
            </button>
            <button className="bg-white p-2 rounded-full shadow-md">
              <Eye size={20} className="text-gray-800" /> {/* Icon xem */}
            </button>
          </div>
        )}
      </div>

      {/* Màu sắc và kích thước */}
      <div className="flex justify-between text-gray-500 text-[12px] mb-2">
        <span>+16 Màu Sắc</span>
        <span>+4 Kích Thước</span>
      </div>

      {/* Tên sản phẩm */}
      <h3 className="text-[14px] font-semibold mb-1">
        ÁO T SHIRT TRƠN IN LOGO NGỰC FSTS001
      </h3>

      {/* Giá sản phẩm */}
      <div className="flex items-center">
        <span className="text-red-500 text-[16px] font-bold mr-2">
          138,000đ
        </span>
        <span className="text-gray-400 text-[14px] line-through">198,000đ</span>
      </div>
    </div>
  );
};

export default ProductCard;
