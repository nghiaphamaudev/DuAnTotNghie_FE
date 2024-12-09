import { useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { Eye, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../../common/types/Product";
import { useProduct } from "../../../contexts/ProductContext";
import AddToCart from "./AddToCart";

type ProductCardProps = {
  item: Product;
  setIsModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductCard = ({ item }: ProductCardProps) => {
  const { getDataProductById } = useProduct();
  const nav = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const countColors = (): number => item?.variants.length;
  const countSizes = (): number =>
    item?.variants.reduce((total, variant) => total + variant.sizes.length, 0);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [isModalVisible])

  const showModal = async (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    const res = await getDataProductById(id)
    if (res?.data?.isActive === false) {
      notification.error({
        message: "Sản phẩm không còn tồn tại!",
        placement: "topRight",
        duration: 4
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } else {
      setIsModalVisible(true);
    }
  };
  const handleOk = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleToProductDetail = async (id: string) => {
    const res = await getDataProductById(id);

    if (res?.data?.isActive === false) {
      notification.error({
        message: "Sản phẩm không còn tồn tại!",
        placement: "topRight",
        duration: 4
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } else {
      nav(`/home/product/${id}`);
    }
  };

  return (
    <div
      className="w-[250px] border rounded-lg overflow-hidden shadow-lg relative p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
              onClick={() => showModal(item?.id)}
            >
              <ShoppingBag size={20} className="text-gray-800" />
              <span className="hidden md:block text-base">Thêm giỏ hàng</span>
            </button>
            {/* Nút Xem chi tiết sản phẩm */}
            <button
              onClick={() => handleToProductDetail(item?.id)}
              className="bg-white p-2 rounded-full shadow-md"
            >
              <Eye size={20} className="text-gray-800" /> {/* Icon Xem */}
            </button>
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
        {/* <span className="text-gray-400 text-[14px] line-through">178,000đ</span> */}
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
