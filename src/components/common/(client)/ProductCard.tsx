import { Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";
import AddToCart from "./AddToCart"; // Import the new AddToCart component
type Props = {
  item: any;
}
const ProductCard = ({ item }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  // Function to handle showing modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle closing modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
          src={item?.coverImg}
          alt="Áo T-Shirt Trơn"
        />

        {/* Nút Thêm Giỏ Hàng và Xem chỉ hiển thị khi hover */}
        {isHovered && (
          <div className="absolute inset-0 flex justify-center items-end  mb-5 space-x-4">
            {/* Button to show the modal */}
            <button
              className="bg-white p-2 rounded-full shadow-md flex justify-start items-center gap-1"
              onClick={showModal} // Show modal on click
            >
              <ShoppingBag size={20} className="text-gray-800" />{" "}
              {/* Icon giỏ hàng */}
              <span className="hidden md:block text-base">Thêm giỏ hàng</span>
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
        {item?.name}
      </h3>

      {/* Giá sản phẩm */}
      <div className="flex items-center">
        <span className="text-red-500 text-[16px] font-bold mr-2">
          {item?.variants[0]?.sizes[0]?.price}đ
        </span>
        <span className="text-gray-400 text-[14px] line-through">198,000đ</span>
      </div>

      {/* AddToCart Modal */}
      <AddToCart
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default ProductCard;
