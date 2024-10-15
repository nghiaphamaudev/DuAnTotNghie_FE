import EzChange from "../../../assets/images/ezchange.svg";
import FreeShip from "../../../assets/images/ezchange.svg";
import Hotline from "../../../assets/images/ezchange.svg";
import Payment from "../../../assets/images/ezchange.svg";
// Import Swiper styles

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "../../../components/common/(client)/ProductCard";

const HomePage = () => {
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
                Miễn phí vận chuyển
              </p>
              <p className="text-[12px] md:text-[14px]">
                Áp dụng cho mọi đơn hàng từ 500k
              </p>
            </div>
          </div>
          <div className="flex w-full items-center space-x-2">
            <img src={Hotline} alt="" />
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
            <img src={Payment} alt="" />
            <div>
              <p className="text-[12px] md:text-[16px] font-semibold">
                Miễn phí vận chuyển
              </p>
              <p className="text-[12px] md:text-[14px]">
                Áp dụng cho mọi đơn hàng từ 500k
              </p>
            </div>
          </div>
        </div>
        {/* End Banner */}

        {/*  Category */}
        <div className="w-full px-4 sm:px-10 md:px-20 bg-[#f0f0f0] py-16">
          <h1 className="text-[24px] font-semibold text-center">
            DANH MỤC SẢN PHẨM
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {/* Polo */}
            <div className="relative group">
              <img
                className="w-full object-cover h-[400px] sm:h-[450px] md:h-[500px]"
                src="https://product.hstatic.net/200000690725/product/tp039_a6940e2c64624279b623c14c12a082c6_master.jpg"
                alt="Áo Polo"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-[24px] font-bold">ÁO POLO</h2>
              </div>
            </div>

            {/* Thun */}
            <div className="relative group">
              <img
                className="w-full object-cover h-[400px] sm:h-[450px] md:h-[500px]"
                src="https://product.hstatic.net/200000690725/product/ts001_eec77c4082074ba79aef59388c49def1_master.jpg"
                alt="Áo Thun"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-[24px] font-bold">ÁO THUN</h2>
              </div>
            </div>

            {/* Sơ mi */}
            <div className="relative group">
              <img
                className="w-full object-cover h-[400px] sm:h-[450px] md:h-[500px]"
                src="https://product.hstatic.net/200000690725/product/tb613---bt900-_24__397096fcf9dc4a9da5a5e7c8ea6112e3_master.jpg"
                alt="Áo Sơ Mi"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-[24px] font-bold">ÁO SƠ MI</h2>
              </div>
            </div>

            {/* Thể thao */}
            <div className="relative group">
              <img
                className="w-full object-cover h-[400px] sm:h-[450px] md:h-[500px]"
                src="https://product.hstatic.net/200000690725/product/5d6f030c-b709-447b-a934-629c527fa5f3_957c27b9670f4507a44f91c44ec8af00_master.jpg"
                alt="Áo Thể Thao"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-[24px] font-bold">
                  ÁO THỂ THAO
                </h2>
              </div>
            </div>
          </div>
        </div>
        {/*  EndCategory */}

        {/*  ProductCard */}
        <div className="product-list flex justify-center items-center flex-wrap gap-3 my-3">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>

        {/*  EndProductCard */}
      </div>
    </>
  );
};

export default HomePage;
