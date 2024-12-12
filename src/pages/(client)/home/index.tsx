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
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { NavigationOptions } from "swiper/types";
import ProductCard from "../../../components/common/(client)/ProductCard";
import { useCategory } from "../../../contexts/CategoryContext";
import { useProduct } from "../../../contexts/ProductContext";
import { getAllFeedbacks } from "../../../services/Feedbacks";

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
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const newProducts = allProduct
    .filter((item) => item.isActive === true)
    .filter((item) => {
      const createdAt = new Date(item?.createdAt); // Giả sử `createdAt` có định dạng ISO 8601
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - createdAt.getTime());
      const diffInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffInDays <= 30; //! Chỉ lấy sản phẩm được tạo trong vòng 30 ngày
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
    if (!activeCategoryProducts || activeCategoryProducts.length === 0)
      return (
        <p className="text-sm text-gray-500 italic">Không có sản phẩm nào.</p>
      );

    const activeProducts = activeCategoryProducts.filter(
      (item) => item.isActive
    );

    if (activeProducts.length === 0)
      return (
        <p className="text-sm text-gray-500 italic">
          Không có sản phẩm nào đang hoạt động.
        </p>
      );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-3">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} item={product} />
        ))}
      </div>
    );
  };

  useEffect(() => {
    setLoadingFeedbacks(true);
    getAllFeedbacks()
      .then((data) => {
        const filteredFeedbacks = data.data.feedbacks.filter(
          (feedback) => feedback.rating >= 3
        );
        setFeedbacks(filteredFeedbacks || []);
        console.log("Feedbacks:", data.data.feedbacks);
      })
      .catch((error) => console.error("Error fetching feedbacks:", error))
      .finally(() => setLoadingFeedbacks(false));
  }, []);
  // console.log("FEedbacks", feedbacks);

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
              <p className="text-[12px] md:text-[14px] italic">
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
              <p className="text-[12px] md:text-[14px] italic">
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
              <p className="text-[12px] md:text-[14px] italic">
                hotline 24/7 : 0964942121
              </p>
            </div>
          </div>
          <div className="flex w-full items-center space-x-2">
            <img src={Payment} alt="" />
            <div>
              <p className="text-[12px] md:text-[16px] font-semibold">
                Thanh toán đa dạng
              </p>
              <p className="text-[12px] md:text-[14px] italic">
                Thanh toán khi nhận hàng, vnpay
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
        <div className="blog flex justify-start items-center gap-4 w-full px-4 sm:px-10 md:px-20 py-10 bg-[#f0f0f0] mt-5">
          <article className="relative overflow-hidden rounded-lg shadow transition hover:shadow-lg">
            <img
              alt=""
              src="https://res.cloudinary.com/dyv5zfnit/image/upload/v1733313084/products/af440d94-6a53-44cc-aa59-55f719a71619.jpg"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
              <div className="p-4 sm:p-6">
                <time
                  datetime="2022-10-10"
                  className="block text-xs text-white/90"
                >
                  {" "}
                  10th Oct 2024{" "}
                </time>

                <a href="home/product/6750423fa4f493679db2c153">
                  <h3 className="mt-0.5 text-lg text-white">
                    Áo khoác nam ESEA thiết kế thêu Mỹ áo khoác bóng chày mới
                    thời trang
                  </h3>
                </a>

                <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
                  Áo khoác nam ESEA mang đến phong cách thể thao và hiện đại với
                  thiết kế thêu Mỹ độc đáo. Được làm từ chất liệu cao cấp, áo
                  khoác này không chỉ bền bỉ mà còn mang lại cảm giác thoải mái
                  cho người mặc.
                </p>
              </div>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-lg shadow transition hover:shadow-lg">
            <img
              alt=""
              src="https://res.cloudinary.com/dyv5zfnit/image/upload/v1732884753/products/6777aeac-4d8c-4eca-b78e-0df0f5a71054.jpg"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
              <div className="p-4 sm:p-6">
                <time
                  datetime="2022-10-10"
                  className="block text-xs text-white/90"
                >
                  {" "}
                  10th Oct 2024{" "}
                </time>

                <a href="http://localhost:5173/home/product/6749b915cbfa920a4e795f87">
                  <h3 className="mt-0.5 text-lg text-white">
                    Áo polo nam cao cấp BASIC DIAMOND
                  </h3>
                </a>

                <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
                  Áo Polo Nam Tay Ngắn Phối Cổ và Tay Form Fitted của Routine
                  mang đến phong cách trẻ trung và năng động. Thiết kế phối cổ
                  và tay áo tạo điểm nhấn độc đáo
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="flex flex-col justify-start items-center w-full px-4 sm:px-10 md:px-20 py-16 my-5">
          <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row justify-between items-center w-full px-4">
            <h1
              id="collection"
              className="text-2xl font-semibold text-center sm:text-left"
            >
              Bộ sưu tập
            </h1>
            <div className="w-full sm:w-auto overflow-x-auto min-w-[200px] mt-4 sm:mt-0">
              <Tabs
                className="w-full sm:w-auto text-black"
                defaultActiveKey="0"
                onChange={(key) => getDataCategoryById(allCategory[key]?.id)}
                items={allCategory.map((item, index) => ({
                  label: (
                    <span className="block text-sm sm:text-base truncate">
                      {item.name}
                    </span>
                  ),
                  key: `${index}`
                }))}
              />
            </div>
          </div>

          <div className="">{renderProductsByCategory()}</div>
        </div>
        {/*----------------------- start feedback section ---------------------------*/}
        <div className="flex flex-col justify-start items-center w-full px-4 sm:px-10 md:px-20 py-10 my-3 bg-gray-100">
          {loadingFeedbacks ? (
            <p className="text-center">Đang tải phản hồi...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có phản hồi nào.</p>
          ) : (
            <section className="bg-white">
              <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl uppercase font-bold tracking-tight text-gray-900">
                  Phản hồi của khách hàng
                </h2>
                <div className="mt-8 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
                  {feedbacks
                    .slice(0, 12)
                    .reverse()
                    .map((feedback) => (
                      <div className="mb-8 sm:break-inside-avoid">
                        <blockquote className="rounded-lg bg-gray-50 p-6 shadow-sm sm:p-8">
                          <div className="flex items-center gap-4">
                            <img
                              alt={feedback?.user.fullName}
                              src={feedback?.user.avatar}
                              className="size-14 rounded-full object-cover"
                            />

                            <div>
                              <div className="flex justify-center gap-0.5 text-yellow-500">
                                {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg> */}

                                {Array.from({ length: 5 }, (_, index) => (
                                  <svg
                                    key={index}
                                    className="size-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={
                                      index < feedback.rating
                                        ? "currentColor"
                                        : "none"
                                    }
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>

                              <p className="mt-0.5 text-lg font-medium text-gray-900">
                                {feedback?.user.fullName}
                              </p>
                            </div>
                          </div>
                          <p className="mt-1 text-sm italic font-medium text-gray-500">
                            <Link
                              to={`/home/product/${feedback?.productId.id}`}
                            >
                              {" "}
                              {feedback?.productId.name}
                            </Link>
                          </p>
                          <p className="mt-4 text-gray-700">
                            {feedback.comment}
                          </p>
                        </blockquote>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}
        </div>
        {/*----------------------- end feedback section ---------------------------*/}
      </div>
    </>
  );
};

export default HomePage;
