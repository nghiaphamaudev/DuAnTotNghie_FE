import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import EzChange from '../src/assets/images/ezchange.svg';
import FreeShip from '../src/assets/images/freeship.svg';
import Hotline from '../src/assets/images/hotline.svg';
import Payment from '../src/assets/images/payment.svg';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import FooterClient from './components/common/(client)/Footer';
import HeaderClient from './components/common/(client)/Header';

const App = () => {




  return (
    <>
      <div>
        {/* header */}
        <HeaderClient />
        {/* End Header */}

        {/* Banner */}
        <div className='relative'>
          <div className="hidden sm:block custom-swiper-button-prev rounded-full"><ChevronLeft /></div>
          <div className="hidden sm:block custom-swiper-button-next"><ChevronRight /></div>
          <Swiper
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            navigation={{
              nextEl: ".custom-swiper-button-next", // Chọn phần tử nút Next
              prevEl: ".custom-swiper-button-prev", // Chọn phần tử nút Prev
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide><img src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" /></SwiperSlide>
            <SwiperSlide><img src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" /></SwiperSlide>
            <SwiperSlide><img src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" /></SwiperSlide>
            <SwiperSlide><img src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" /></SwiperSlide>
          </Swiper>
        </div>
        <div className='w-full px-10 py-4 gap-5 md:px-16 lg:px-20 lg:py-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
          <div className='flex w-full items-center space-x-2'>
            <img src={FreeShip} alt="" />
            <div>
              <p className='text-[12px] md:text-[16px] font-semibold'>Miễn phí vận chuyển</p>
              <p className='text-[12px] md:text-[14px]'>Áp dụng cho mọi đơn hàng từ 500k</p>
            </div>
          </div>
          <div className='flex w-full items-center space-x-2'>
            <img src={EzChange} alt="" />
            <div>
              <p className='text-[12px] md:text-[16px] font-semibold'>Miễn phí vận chuyển</p>
              <p className='text-[12px] md:text-[14px]'>Áp dụng cho mọi đơn hàng từ 500k</p>
            </div>
          </div>
          <div className='flex w-full items-center space-x-2'>
            <img src={Hotline} alt="" />
            <div>
              <p className='text-[12px] md:text-[16px] font-semibold'>Miễn phí vận chuyển</p>
              <p className='text-[12px] md:text-[14px]'>Áp dụng cho mọi đơn hàng từ 500k</p>
            </div>
          </div>
          <div className='flex w-full items-center space-x-2'>
            <img src={Payment} alt="" />
            <div>
              <p className='text-[12px] md:text-[16px] font-semibold'>Miễn phí vận chuyển</p>
              <p className='text-[12px] md:text-[14px]'>Áp dụng cho mọi đơn hàng từ 500k</p>
            </div>
          </div>
        </div>
        {/* End Banner */}
        <div className='w-full px-4 sm:px-10 md:px-20 bg-[#f7f1e3] py-16'>
          <h1 className='text-[24px] font-semibold'>DANH MỤC SẢN PHẨM</h1>
          <div className='grid grid-cols-4 gap-2 sm:gap-4 md:gap-16 mt-4 sm:mt-8'>
            <div className='w-full'>
              <img className='w-full object-cover h-[200px] sm:h-[250px] md:h-[350px]' src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" />
            </div>
            <div className='w-full'>
              <img className='w-full object-cover h-[200px] sm:h-[250px] md:h-[350px]' src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" />
            </div>
            <div className='w-full'>
              <img className='w-full object-cover h-[200px] sm:h-[250px] md:h-[350px]' src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" />
            </div>
            <div className='w-full'>
              <img className='w-full object-cover h-[200px] sm:h-[250px] md:h-[350px]' src="https://intphcm.com/data/upload/dung-luong-banner-thoi-trang.jpg" alt="" />
            </div>
          </div>
        </div>

        {/*  Footer */}
        <FooterClient />
        {/*  EndFooter */}

      </div>
    </>
  );
};

export default App;
