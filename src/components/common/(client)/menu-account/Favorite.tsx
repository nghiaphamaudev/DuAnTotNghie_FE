import { Typography } from "antd";
import { Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";
import AddToCart from "../AddToCart";
import ao from "../../../../assets/images/ao.png";

const Favorite = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(false);

  // Dữ liệu sản phẩm giả lập (thay thế bằng dữ liệu thực từ API)
  const products = [
    {
      id: 1,
      name: "ÁO T SHIRT TRƠN IN LOGO NGỰC FSTS001",
      price: 138000,
      originalPrice: 198000,
      discount: 30,
      imageUrl:
        "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg",
    },
    {
      id: 2,
      name: "ÁO T SHIRT TRƠN IN LOGO NGỰC FSTS001",
      price: 138000,
      originalPrice: 198000,
      discount: 30,
      imageUrl:
        "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg",
    },
    // Bạn có thể thêm các sản phẩm khác hoặc để trống []
  ];

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <>
      <div className="p-6">
        <Typography.Title level={3}>Sản phẩm yêu thích</Typography.Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Kiểm tra nếu không có sản phẩm */}
          {products.length === 0 ? (
            <div className="col-span-3 flex justify-center items-center">
              <div className=" flex col-span-3 flex-col justify-center items-center">
                <img
                  src={ao} // Thay bằng đường dẫn đến hình ảnh của bạn
                  alt="Không có sản phẩm"
                  className="w-[300px] h-auto"
                />
                <Typography.Text className="text-gray-500 text-center">
                  Hiện không có sản phẩm nào đã xem gần đây.
                </Typography.Text>
              </div>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-lg relative p-4"
                onMouseEnter={() => setHoveredIndex(true)}
                onMouseLeave={() => setHoveredIndex(false)}
              >
                <div className="absolute z-10 top-2 right-2 bg-red-500 text-white text-[14px] font-semibold rounded-full px-2 py-1">
                  -{product.discount}%
                </div>
                <div className="relative">
                  <img
                    className="w-full object-cover h-[250px] mb-4"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                  {hoveredIndex === true && (
                    <div className="absolute inset-0 flex justify-center items-end mb-5 space-x-4">
                      <button
                        className="bg-white p-2 rounded-full shadow-md flex justify-start items-center gap-1"
                        onClick={showModal}
                      >
                        <ShoppingBag size={20} className="text-gray-800" />
                        <span className="hidden md:block text-base">
                          Thêm giỏ hàng
                        </span>
                      </button>
                      <button className="bg-white p-2 rounded-full shadow-md">
                        <Eye size={20} className="text-gray-800" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-gray-500 text-[12px] mb-2">
                  <span>+16 Màu Sắc</span>
                  <span>+4 Kích Thước</span>
                </div>
                <h3 className="text-[14px] font-semibold mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center">
                  <span className="text-red-500 text-[16px] font-bold mr-2">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="text-gray-400 text-[14px] line-through">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <AddToCart
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default Favorite;
