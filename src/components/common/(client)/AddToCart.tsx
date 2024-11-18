import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, InputNumber, Modal, notification, Radio, RadioChangeEvent } from "antd";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Product,
  ProductSize,
  ProductVariant
} from "../../../common/types/Product";
import { useCart } from "../../../contexts/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";


interface AddToCartProps {
  isModalVisible: boolean;
  handleOk: (quantity: number) => void;
  handleCancel: () => void;
  item: Product; // Nhận dữ liệu sản phẩm từ ProductCard
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const AddToCart = ({
  isModalVisible,
  handleCancel,
  item,
  setIsModalVisible
}: AddToCartProps) => {
  //context
  const { addItemToCart } = useCart();
  //state

  const [color, setColor] = useState<string>(item?.variants[0]?.id);
  const [size, setSize] = useState<string>(
    item?.variants[0]?.sizes[0]?.id
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    item?.variants[0] || null
  );
  const [price, setPrice] = useState<number>(item?.variants[0]?.sizes[0]?.price);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef<any>(null);


  //lifecycle
  useEffect(() => {
    const variant = item?.variants?.find((v) => v.id === color);
    setSelectedVariant(variant || item?.variants[0]);
    if (variant && variant?.sizes.length > 0) {
      setSize(variant?.sizes[0].id); // Reset size when color changes
    }
  }, [color, item?.variants]);

  useEffect(() => {
    const variant = item?.variants.find((v) => v.id === color);
    const sizeOption = variant?.sizes.find((s) => s.id === size);
    if (sizeOption) {
      setPrice(sizeOption.price);
    }
  }, [color, size, item?.variants]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.navigation) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  //function
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Kiểm tra nếu ký tự không phải là số (0-9)
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault(); // Chặn ký tự không phải số
    }
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }
  
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

  const handleAddItemToCart = async (id: string) => {
    try {
      const payload = {
        productId: id,
        variantId: color,
        sizeId: size,
        quantity: quantity,
      }
      const res = await addItemToCart(payload);
      if (res && res?.status) {
        notification.success({
          message: "Thêm sản phẩm thành công",
          placement: "topRight",
          duration: 2,
        });
        setIsModalVisible(false)
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Modal
      open={isModalVisible}
      onCancel={() => {
        handleCancel();
        setQuantity(1);
        setColor(item?.variants[0]?.id);
        setSize(item?.variants[0]?.sizes[0]?.id);
        // setActiveIndex(0);
      }}
      width={900}
      footer={null}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left side - Product images */}
        <div className="col-span-12 md:col-span-5">
          {/* Swiper for the cover image */}
          <div className="relative">
            <button
              disabled={activeIndex === 0}
              className="hidden disabled:opacity-25 sm:block custom-swiper-button-prev">
              <ChevronLeft />
            </button>
            <button
              disabled={activeIndex === (selectedVariant?.images?.length ?? 0) - 1}
              className="hidden disabled:opacity-25 sm:block custom-swiper-button-next">
              <ChevronRight />
            </button>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={10}
              slidesPerView={1}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              initialSlide={activeIndex}
              pagination={{
                clickable: true
              }}
              navigation={{
                nextEl: ".custom-swiper-button-next",
                prevEl: ".custom-swiper-button-prev"
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              {selectedVariant?.images.map((image: string, index: number) => (
                <SwiperSlide className="w-[400px] h-[300px]" key={index}>
                  <img
                    src={image}
                    alt={`Product variant ${color} image ${index + 1}`}
                    className="w-full h-full md:h-[400px] object-cover mb-4" // Fixed height with responsive adjustments
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnails of variant images */}
          <div className="flex justify-start gap-2 mt-4">
            {selectedVariant?.images.map((image: string, index: number) => (
              <div
                onClick={() => handleThumbnailClick(index)}
                key={index}
                className={`w-1/4 aspect-w-1 aspect-h-1 cursor-pointer ${index === activeIndex ? "border border-blue-500" : ""
                  }`}
              >
                <img
                  src={image}
                  alt={`Product thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="col-span-12 md:col-span-7">
          <h2 className="text-xl font-bold">{item?.name}</h2>
          <p className="text-gray-500 mb-2">Còn hàng | Thương hiệu: FSHIRT</p>

          {/* Rating section */}
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-lg">
              {"★".repeat(Math.round(item?.ratingAverage))} {/* Display stars */}
              {"☆".repeat(5 - Math.round(item?.ratingAverage))}{" "}
              {/* Empty stars */}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              ({item?.ratingQuantity} đánh giá)
            </span>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-red-500 text-xl font-semibold">
              {price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </span>
            <span className="text-gray-400 text-lg line-through ml-4">
              850,000 đ
            </span>
            <span className="text-red-500 ml-2">-24%</span>
          </div>

          {/* Color selection */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">Màu sắc:</p>
            <Radio.Group onChange={onChangeColor} value={color}>
              {item?.variants.map((variant: ProductVariant) => (
                <Radio.Button key={variant.id} value={variant.id}>
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
                <Radio.Button key={sizeOption.id} value={sizeOption.id}>
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
                max={10}
                value={quantity}
                onChange={onChangeQuantity}
                onKeyDown={handleKeyPress}
                className="w-14 mx-2"
              />
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>
          </div>

          {/* Add to cart button */}
          <button onClick={() => handleAddItemToCart(item.id)} className="bg-red-500 flex items-center justify-center gap-2 w-full text-white text-base font-semibold uppercase py-3">
            <ShoppingCartOutlined className="text-2xl" />
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddToCart;
