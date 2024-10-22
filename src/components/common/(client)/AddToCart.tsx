import { useState, useEffect } from "react";
import { Modal, Button, Radio, InputNumber, RadioChangeEvent } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {
  Product,
  ProductSize,
  ProductVariant
} from "../../../common/types/Product";

interface AddToCartProps {
  isModalVisible: boolean;
  handleOk: (quantity: number) => void;
  handleCancel: () => void;
  item: Product; // Nhận dữ liệu sản phẩm từ ProductCard
}

const AddToCart = ({
  isModalVisible,
  handleOk,
  handleCancel,
  item
}: AddToCartProps) => {
  const [color, setColor] = useState<string>(item.variants[0]?.color || "");
  const [size, setSize] = useState<string>(
    item.variants[0]?.sizes[0]?.nameSize || "S"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    item.variants[0] || null
  );

  useEffect(() => {
    const variant = item.variants.find((v) => v.color === color);
    setSelectedVariant(variant || item.variants[0]);
    if (variant && variant.sizes.length > 0) {
      setSize(variant.sizes[0].nameSize); // Reset size when color changes
    }
  }, [color, item.variants]);

  const onChangeQuantity = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const onChangeColor = (e: RadioChangeEvent) => {
    setColor(e.target.value);
  };

  const onChangeSize = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  return (
    <Modal
      title={item.name}
      visible={isModalVisible}
      onOk={() => handleOk(quantity)}
      onCancel={handleCancel}
      width={900}
      footer={null}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left side - Product images */}
        <div className="col-span-12 md:col-span-5">
          {/* Swiper for the cover image */}
          <Swiper spaceBetween={10} slidesPerView={1}>
            {selectedVariant?.images.map((image: string, index: number) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Product variant ${color} image ${index + 1}`}
                  className="w-full h-[300px] md:h-[400px] object-cover mb-4" // Fixed height with responsive adjustments
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails of variant images */}
          <div className="flex justify-start gap-2 mt-4">
            {selectedVariant?.images.map((image: string, index: number) => (
              <div key={index} className="w-1/4">
                <img
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="col-span-12 md:col-span-7">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <p className="text-gray-500 mb-2">Còn hàng | Thương hiệu: FSHIRT</p>

          {/* Rating section */}
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-lg">
              {"★".repeat(Math.round(item.ratingAverage))} {/* Display stars */}
              {"☆".repeat(5 - Math.round(item.ratingAverage))}{" "}
              {/* Empty stars */}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              ({item.ratingQuantity} đánh giá)
            </span>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-red-500 text-xl font-semibold">
              {selectedVariant?.sizes
                .find((s) => s.nameSize === size)
                ?.price.toLocaleString()}
              đ
            </span>
            <span className="text-gray-400 text-lg line-through ml-4">
              850,000đ
            </span>
            <span className="text-red-500 ml-2">-24%</span>
          </div>

          {/* Color selection */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Màu sắc:</p>
            <Radio.Group onChange={onChangeColor} value={color}>
              {item.variants.map((variant: ProductVariant) => (
                <Radio.Button key={variant.id} value={variant.color}>
                  {variant.color}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          {/* Size selection */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Kích thước:</p>
            <Radio.Group onChange={onChangeSize} value={size}>
              {selectedVariant?.sizes.map((sizeOption: ProductSize) => (
                <Radio.Button key={sizeOption.id} value={sizeOption.nameSize}>
                  {sizeOption.nameSize}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          {/* Quantity selection */}
          <div className="mb-6">
            <p className="text-gray-700 font-semibold">Số lượng:</p>
            <div className="flex items-center">
              <Button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </Button>
              <InputNumber
                min={1}
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
