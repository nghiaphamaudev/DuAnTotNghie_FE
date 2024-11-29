import EzChange from "../../../assets/images/ezchange.svg";
import FreeShip from "../../../assets/images/freeship.svg";
import Hotline from "../../../assets/images/hotline.svg";
import Payment from "../../../assets/images/payment.svg";
// Import Swiper styles

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../../../components/common/(client)/ProductCard";
import { useProduct } from "../../../contexts/ProductContext";
import { Tabs } from "antd";
import { useRef } from "react";
import { NavigationOptions } from "swiper/types";
import { Products } from "../../../common/types/Product";

const HomePage = () => {
  // context
  const { allProduct } = useProduct();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const renderProductsBySeason = (season: string) => {
    const filteredProducts = allProduct.filter(
      (product) => product.category === season
    );

    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mx-10">
          {filteredProducts.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        {/* Banner */}
        <div className="relative">
          <div className="hidden sm:block custom-swiper-button-prev rounded-full">
            <ChevronLeft />
          </div>
          <div className="hidden sm:block custom-swiper-button-next">
            <ChevronRight />
          </div>
          <Swiper
            spaceBetween={30}
            pagination={{
              clickable: true
            }}
            navigation={{
              nextEl: ".custom-swiper-button-next", // Chọn phần tử nút Next
              prevEl: ".custom-swiper-button-prev" // Chọn phần tử nút Prev
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img
                src="https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=536"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://media.canifa.com/Simiconnector/BannerSlider/s/s/ss1010_topbanner_desktop-ud-07.10.webp"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://theme.hstatic.net/200000690725/1001078549/14/slide_4_img.jpg?v=536"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://media.canifa.com/Simiconnector/BannerSlider/s/p/spmoi_topbanner_desktop-30sep.webp"
                alt=""
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="w-full px-10 py-4  gap-5 md:px-16 lg:px-20 lg:py-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex w-full items-center space-x-2">
            <img src={FreeShip} alt="" />
            <div>
              <p className="text-[12px] md:text-[16px] font-semibold">
                Miễn phí vận chuyển
              </p>
              <p className="text-[12px] md:text-[14px]">
                Áp dụng cho mọi đơn hàng từ 500k
              </p>
            </div>
          </div>
          <div className="flex w-full items-center space-x-2">
            <img src={EzChange} alt="" />
            <div>
              <p className="text-[12px] md:text-[16px] font-semibold">
                Đổi hàng dễ dàng
              </p>
              <p className="text-[12px] md:text-[14px]">
                7 ngày đổi hàng vì bất kì lí do gì
              </p>
            </div>
          </div>
          <div className="flex w-full items-center space-x-2">
            <img src={Hotline} alt="" />
            <div>
              <p className="text-[12px] md:text-[16px] font-semibold">
                Hỗ trợ nhanh chóng
              </p>
              <p className="text-[12px] md:text-[14px]">
                HOTLINE 24/7 : 0964942121
              </p>
            </div>
          </div>
          <div className="flex w-full items-center space-x-2">
            <img src={Payment} alt="" />
            <div>
              <p className="text-[12px] md:text-[16px] font-semibold">
                Thanh toán đa dạng
              </p>
              <p className="text-[12px] md:text-[14px]">
                Thanh toán khi nhận hàng, Napas, Visa, Chuyển Khoản
              </p>
            </div>
          </div>
        </div>
        {/* End Banner */}

        {/*  Category */}
        <div className="w-full px-4 sm:px-10 md:px-20 bg-[#f0f0f0] py-10">
          <h1 className="text-[24px] font-semibold text-center mb-2">
            DANH MỤC SẢN PHẨM
          </h1>
          <div className="navigation flex justify-end items-center mb-3 gap-3">
            <button ref={prevRef}>
              <ChevronLeft />
            </button>
            <button ref={nextRef}>
              <ChevronRight />
            </button>
          </div>
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current
            }}
            onBeforeInit={(swiper) => {
              if (swiper.params.navigation) {
                (swiper.params.navigation as NavigationOptions).prevEl =
                  prevRef.current;
                (swiper.params.navigation as NavigationOptions).nextEl =
                  nextRef.current;
              }
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
          >
            {/* Polo */}
            <SwiperSlide>
              <div className="relative group">
                <img
                  className="w-full object-cover h-[700px] sm:h-[600px] md:h-[700px] lg:h-[750px] aspect-square"
                  src="https://product.hstatic.net/200000690725/product/tp039_a6940e2c64624279b623c14c12a082c6_master.jpg"
                  alt="Áo Polo"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-white text-[24px] font-bold">ÁO POLO</h2>
                </div>
              </div>
            </SwiperSlide>

            {/* Thun */}
            <SwiperSlide>
              <div className="relative group">
                <img
                  className="w-full object-cover h-[700px] sm:h-[600px] md:h-[700px] lg:h-[750px] aspect-square"
                  src="https://product.hstatic.net/200000690725/product/ts001_eec77c4082074ba79aef59388c49def1_master.jpg"
                  alt="Áo Thun"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-white text-[24px] font-bold">ÁO THUN</h2>
                </div>
              </div>
            </SwiperSlide>

            {/* Sơ mi */}
            <SwiperSlide>
              <div className="relative group">
                <img
                  className="w-full object-cover h-[700px] sm:h-[600px] md:h-[700px] lg:h-[750px] aspect-square"
                  src="https://product.hstatic.net/200000690725/product/tb613---bt900-_24__397096fcf9dc4a9da5a5e7c8ea6112e3_master.jpg"
                  alt="Áo Sơ Mi"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-white text-[24px] font-bold">ÁO SƠ MI</h2>
                </div>
              </div>
            </SwiperSlide>

            {/* Thể thao */}
            <SwiperSlide>
              <div className="relative group">
                <img
                  className="w-full object-cover h-[700px] sm:h-[600px] md:h-[700px] lg:h-[750px] aspect-square"
                  src="https://product.hstatic.net/200000690725/product/5d6f030c-b709-447b-a934-629c527fa5f3_957c27b9670f4507a44f91c44ec8af00_master.jpg"
                  alt="Áo Thể Thao"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-white text-[24px] font-bold">
                    ÁO THỂ THAO
                  </h2>
                </div>
              </div>
            </SwiperSlide>
            {/* Thể thao */}
            <SwiperSlide>
              <div className="relative group">
                <img
                  className="w-full object-cover h-[700px] sm:h-[600px] md:h-[700px] lg:h-[750px] aspect-square"
                  src="https://product.hstatic.net/200000690725/product/5d6f030c-b709-447b-a934-629c527fa5f3_957c27b9670f4507a44f91c44ec8af00_master.jpg"
                  alt="Áo Thể Thao"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-white text-[24px] font-bold">
                    ÁO THỂ THAO
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        {/*  EndCategory */}
        <div
          id="hotproduct"
          className="product-list flex flex-col justify-start items-center"
        >
          <h3 className="text-2xl font-bold my-5">Sản phẩm bán chạy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-3">
            {allProduct.filter((item) => item.isActive === true).map((item: Products, index: number) => (
              <ProductCard key={index} item={item} />
            ))}
          </div>
        </div>
        {/* EndProductCard */}
        <div className="w-full px-4 sm:px-10 md:px-20 bg-[#f0f0f0] py-16 my-5">
          <h1 className="text-2xl font-semibold text-center">
            Sản phẩm theo mùa
          </h1>
          <Tabs defaultActiveKey="spring" centered>
            <Tabs.TabPane
              className="text-2xl font-semibold"
              tab="Spring"
              key="spring"
            >
              {renderProductsBySeason("653b6fbd34bc9d789b0d357a")}
            </Tabs.TabPane>
            <Tabs.TabPane
              className="text-2xl font-semibold"
              tab="Summer"
              key="summer"
            >
              {renderProductsBySeason("653b6fbd34bc9d789b0d357b")}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default HomePage;
