/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Modal, Button, Radio, InputNumber } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import "swiper/css/pagination"; // Import pagination styles

interface AddToCartProps {
  isModalVisible: boolean;
  handleOk: (quantity: number) => void;
  handleCancel: () => void;
}

const AddToCart = ({
  isModalVisible,
  handleOk,
  handleCancel
}: AddToCartProps) => {
  const [color, setColor] = useState<string>("Xám nhạt");
  const [size, setSize] = useState<string>("S");
  const [quantity, setQuantity] = useState<number>(1);

  const onChangeQuantity = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const onChangeColor = (e: any) => {
    setColor(e.target.value);
  };

  const onChangeSize = (e: any) => {
    setSize(e.target.value);
  };

  const productImages = [
    "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg",
    "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg",
    "https://product.hstatic.net/200000690725/product/fsts018_48c852393b464907b40cba8adb235737_master.jpg"
  ];

  return (
    <Modal
      title="Áo khoác da lộn basic cổ cao FWCL002"
      visible={isModalVisible}
      onOk={() => handleOk(quantity)}
      onCancel={handleCancel}
      width={900}
      footer={null}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left side - Product images */}
        <div className="col-span-12 md:col-span-5">
          <Swiper spaceBetween={10} slidesPerView={1}>
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full mb-4"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex space-x-2">
            {productImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-24 sm:w-20 sm:h-20 border rounded"
              />
            ))}
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="col-span-12 md:col-span-7">
          <h2 className="text-xl font-bold">
            Áo khoác da lộn basic cổ cao FWCL002
          </h2>
          <p className="text-gray-500 mb-2">Còn hàng | Thương hiệu: FSHIRT</p>

          <div className="flex items-center mb-4">
            <span className="text-red-500 text-xl font-semibold">649,000đ</span>
            <span className="text-gray-400 text-lg line-through ml-4">
              850,000đ
            </span>
            <span className="text-red-500 ml-2">-24%</span>
          </div>

          {/* Color selection */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Màu sắc:</p>
            <Radio.Group
              onChange={onChangeColor}
              value={color}
              className="custom-radio-group"
            >
              <Radio.Button value="Xám nhạt">Xám nhạt</Radio.Button>
              <Radio.Button value="Xanh rêu đậm">Xanh rêu đậm</Radio.Button>
              <Radio.Button value="Be">Be</Radio.Button>
              <Radio.Button value="Dark Navy">Dark Navy</Radio.Button>
              <Radio.Button value="Đen">Đen</Radio.Button>
              <Radio.Button value="Xám đậm">Xám đậm</Radio.Button>
            </Radio.Group>
          </div>

          {/* Size selection */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Kích thước:</p>
            <Radio.Group
              onChange={onChangeSize}
              value={size}
              className="custom-radio-group"
            >
              <Radio.Button value="S">S</Radio.Button>
              <Radio.Button value="M">M</Radio.Button>
              <Radio.Button value="L">L</Radio.Button>
              <Radio.Button value="XL">XL</Radio.Button>
              <Radio.Button value="XXL">XXL</Radio.Button>
            </Radio.Group>
          </div>

          {/* Quantity selection */}
          <div className="mb-6">
            <p className="text-gray-700 font-semibold">Số lượng:</p>
            <div className="flex items-center">
              <Button
                onClick={() =>
                  setQuantity((prevQuantity) =>
                    prevQuantity > 1 ? prevQuantity - 1 : 1
                  )
                }
              >
                -
              </Button>
              <InputNumber
                min={1}
                max={10}
                value={quantity}
                onChange={onChangeQuantity}
                className="w-20 mx-2"
              />
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>
          </div>

          {/* Add to cart button */}
          <Link to="/cart">
            <button className="bg-red-500 flex items-center justify-center gap-2 w-full text-white text-base font-semibold uppercase py-3">
              <ShoppingCartOutlined className="text-2xl" />
              <span>Thêm vào giỏ</span>
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default AddToCart;
