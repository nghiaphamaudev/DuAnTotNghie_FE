import React, { useState } from "react";
import { Eye, ShoppingBag } from "lucide-react";
import { Typography } from "antd";
import ao from "../../../../assets/images/ao.png";
import AddToCart from "../AddToCart";
import { Product } from "../../../../common/types/Product";
// Import type Product

const ViewHistoty = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

  // Dữ liệu sản phẩm giả lập (phù hợp với type Product)
  const products: Product[] = [
    {
      id: "1",
      name: "ÁO T SHIRT TRƠN IN LOGO NGỰC FSTS001",
      description: "Áo thun trơn chất liệu cotton, thoáng mát, thoải mái.",
      coverImg:
        "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg",
      variants: [
        {
          _id: "1",
          color: "Đỏ",
          images: [
            "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg"
          ],
          sizes: [
            { _id: "1", nameSize: "M", price: 138000, inventory: 10, id: "1" },
            { _id: "2", nameSize: "L", price: 140000, inventory: 5, id: "2" }
          ],
          id: "1"
        }
      ],
      discount: 30,
      colorsAvailable: 3,
      sizesAvailable: 5,
      category: "Áo thun",
      ratingAverage: 4.5,
      ratingQuantity: 100,
      status: "Available"
    },
    {
      id: "2",
      name: "ÁO T SHIRT TRƠN IN LOGO NGỰC FSTS002",
      description: "Áo thun phong cách trẻ trung, năng động.",
      coverImg:
        "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg",
      variants: [
        {
          _id: "2",
          color: "Xanh",
          images: [
            "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg"
          ],
          sizes: [
            { _id: "1", nameSize: "M", price: 150000, inventory: 15, id: "1" },
            { _id: "2", nameSize: "XL", price: 155000, inventory: 8, id: "2" }
          ],
          id: "2"
        }
      ],
      discount: 25,
      colorsAvailable: 4,
      sizesAvailable: 6,
      category: "Áo thun",
      ratingAverage: 4.2,
      ratingQuantity: 80,
      status: "Available"
    }
  ];

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <>
      <div className="p-6">
        <Typography.Title level={3}>Đã xem gần đây</Typography.Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Kiểm tra nếu không có sản phẩm */}
          {products.length === 0 ? (
            <div className="flex col-span-3 flex-col justify-center items-center">
              <img
                src={ao} // Thay bằng đường dẫn đến hình ảnh của bạn
                alt="Không có sản phẩm"
                className="w-[300px] h-auto"
              />
              <Typography.Text className="text-gray-500 text-center">
                Hiện không có sản phẩm nào đã xem gần đây.
              </Typography.Text>
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-lg relative p-4"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute z-10 top-2 right-2 bg-red-500 text-white text-[14px] font-semibold rounded-full px-2 py-1">
                  -{product.discount}%
                </div>
                <div className="relative">
                  <img
                    className="w-full object-cover h-[250px] mb-4"
                    src={product.coverImg}
                    alt={product.name}
                  />
                  {hoveredIndex === index && (
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
                  <span>+{product.colorsAvailable} Màu Sắc</span>
                  <span>+{product.sizesAvailable} Kích Thước</span>
                </div>
                <h3 className="text-[14px] font-semibold mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center">
                  <span className="text-red-500 text-[16px] font-bold mr-2">
                    {product.variants[0].sizes[0].price.toLocaleString()}đ
                  </span>
                  <span className="text-gray-400 text-[14px] line-through">
                    {(
                      product.variants[0].sizes[0].price *
                      (100 / (100 - product.discount))
                    ).toLocaleString()}
                    đ
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
          item={products[0]} // Hoặc sản phẩm cụ thể mà bạn muốn
          setIsModalVisible={setIsModalVisible}
        />
      </div>
    </>
  );
};

export default ViewHistoty;
