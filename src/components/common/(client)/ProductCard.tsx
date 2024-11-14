import { Eye, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import AddToCart from "./AddToCart";
import { Product } from "../../../common/types/Product";

type ProductCardProps = {
  item: Product;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductCard = ({ item }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const countColors = (): number => item?.variants.length;
  const countSizes = (): number =>
    item?.variants.reduce((total, variant) => total + variant.sizes.length, 0);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <div
      className="w-[250px] border rounded-lg overflow-hidden shadow-lg relative p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item?.discount && (
        <div className="absolute z-10 top-2 right-2 bg-red-500 text-white text-[14px] font-semibold rounded-full px-2 py-1">
          -{item?.discount}%
        </div>
      )}
      <div className="relative">
        <img
          className="w-full object-cover h-[250px] mb-4"
          src={item?.coverImg}
          alt={item?.name}
        />
        {isHovered && (
          <div className="absolute inset-0 flex justify-center items-end mb-5 space-x-4">
            <button
              className="bg-white p-2 rounded-full shadow-md flex justify-start items-center gap-1"
              onClick={showModal}
            >
              <ShoppingBag size={20} className="text-gray-800" />
              <span className="hidden md:block text-base">Thêm giỏ hàng</span>
            </button>
            {/* Nút Xem chi tiết sản phẩm */}
            <Link to={`/home/product/${item?.id}`} className="bg-white p-2 rounded-full shadow-md">
              <Eye size={20} className="text-gray-800" /> {/* Icon Xem */}
            </Link>

          </div>
        )}
      </div>
      <div className="flex justify-between text-gray-500 text-[12px] mb-2">
        <span>+{countColors()} Màu Sắc</span>
        <span>+{countSizes()} Kích Thước</span>
      </div>
      <h3 className="text-[14px] font-semibold mb-1 line-clamp-1">
        {item?.name}
      </h3>
      <div className="flex items-center">
        <span className="text-red-500 text-[16px] font-bold mr-2">
          {item?.variants[0]?.sizes[0]?.price.toLocaleString()}đ
        </span>
        <span className="text-gray-400 text-[14px] line-through">198,000đ</span>
      </div>
      <AddToCart
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        item={item}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
};

export default ProductCard;
