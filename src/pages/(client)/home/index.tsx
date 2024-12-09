import EzChange from "../../../assets/images/ezchange.svg";
import FreeShip from "../../../assets/images/freeship.svg";
import Hotline from "../../../assets/images/hotline.svg";
import Payment from "../../../assets/images/payment.svg";
import Video from "../../../assets/videos/Ngang - gio.mp4";
// Import Swiper styles

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { NavigationOptions } from "swiper/types";
import ProductCard from "../../../components/common/(client)/ProductCard";
import { useCategory } from "../../../contexts/CategoryContext";
import { useProduct } from "../../../contexts/ProductContext";
// import { Products } from "../../../common/types/Product";

const HomePage = () => {
  const navigate = useNavigate();
  // context
  const { allProduct } = useProduct();
  const {
    allCategory,
    activeCategoryProducts,
    getAllDataCategory,
    getDataCategoryById
  } = useCategory();
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const newProducts = allProduct
    .filter((item) => item.isActive === true)
    .filter((item) => {
      const createdAt = new Date(item?.createdAt); // Giả sử `createdAt` có định dạng ISO 8601
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - createdAt.getTime());
      const diffInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffInDays <= 7; //! Chỉ lấy sản phẩm được tạo trong vòng 4 ngày
    });
  // Hàm hiển thị thêm sản phẩm
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };
  // Hàm ẩn bớt sản phẩm
  const handleShowLess = () => {
    setVisibleCount((prev) => (prev - (prev - 8) > 0 ? prev - 8 : 8));
  };
  useEffect(() => {
    setLoading(true);
    getAllDataCategory()
      .then(() => {
        if (allCategory.length > 0) {
          getDataCategoryById(allCategory[0]?.id);
        }
      })
      .finally(() => setLoading(false));
  }, []);
  // console.log(category);
  const renderProductsByCategory = () => {
    if (loading) return <p>Đang tải...</p>;
    if (!activeCategoryProducts || activeCategoryProducts?.length === 0)
      return <p>Không có sản phẩm nào.</p>;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeCategoryProducts
          ?.filter((item) => item?.isActive == true)
          .map((product) => (
            <ProductCard key={product?.id} item={product} />
          ))}
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
            {allCategory?.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative group cursor-pointer"
                  onClick={() => navigate(`/product?category=${item.id}`)}
                >
                  <img
                    className="w-full object-cover h-[700px] sm:h-[600px] md:h-[700px] lg:h-[750px] aspect-square"
                    src={item?.imageCategory}
                    alt={item?.name}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h2 className="text-white text-[24px] font-bold">
                      {item?.name}
                    </h2>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/*  EndCategory */}
        <div
          id="newproduct"
          className="product-list flex flex-col justify-start items-center w-full px-4 "
        >
          <h3 className="text-2xl font-bold my-5">Sản phẩm mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-3">
            {newProducts.slice(0, visibleCount).map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
          </div>

          {visibleCount < newProducts.length && (
            <button
              onClick={handleShowMore}
              className="mt-4 px-5 py-2 text-black text-sm rounded border border-black uppercase hover:bg-black hover:text-white transition duration-300"
            >
              Hiển thị thêm
            </button>
          )}
          {visibleCount > newProducts.length && (
            <button
              onClick={handleShowLess}
              className="mt-4 px-5 py-2 text-black text-sm rounded border border-black uppercase hover:bg-black hover:text-white transition duration-300"
            >
              Ẩn bớt
            </button>
          )}
        </div>
        {/* EndProductCard */}
        <div className="video flex flex-col justify-start items-center w-full px-4 sm:px-10 md:px-20 py-10 bg-[#f0f0f0] mt-5">
          <video
            className="w-full h-[100px] sm:h-[200px] md:h-[300px] lg:h-[400px]
            object-cover"
            src={Video}
            autoPlay
            loop
            muted
          ></video>
        </div>

        <div className="flex flex-col justify-start items-center w-full px-4 sm:px-10 md:px-20 py-16 my-5">
          <h1 className="text-2xl font-semibold text-center">Bộ sưu tập</h1>
          <Tabs
            defaultActiveKey="0"
            onChange={(key) => getDataCategoryById(allCategory[key]?.id)}
            items={allCategory.map((item, index) => ({
              label: item.name,
              key: `${index}`
            }))}
          />
          <div className="mt-4">{renderProductsByCategory()}</div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
