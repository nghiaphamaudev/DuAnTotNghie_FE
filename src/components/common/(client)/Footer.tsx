import { Mail } from "lucide-react";
import listsocial from "../../../assets/images/listsocial.png";
import vnpay from "../../../assets/images/vnpay.png";
import zalopay from "../../../assets/images/zalopay.png";

const FooterClient = () => {
  return (
    <>
      <div id="footer" className="mx-auto px-4 md:px-8 lg:px-16 pb-10 mt-20">
        {/* <img src={cart} alt="" /> */}

        {/* Logo */}
        <div className="flex justify-start items-end mb-10">
          <span className="text-bg-3 text-5xl font-semibold">F</span>
          <p className="text-2xl font-semibold">Shirt</p>
        </div>

        {/* Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* First Column */}
          <div className="info-item flex flex-col">
            <h3 className="uppercase font-semibold mb-3">
              Thời trang nam FSHiRT
            </h3>
            <p className="text-[#9a9a9a]">
              Hệ thống thời trang cho phái mạnh hàng đầu Việt Nam, hướng tới
              phong cách nam tính, lịch lãm và trẻ trung.
            </p>
          </div>

          {/* Second Column */}
          <div className="info-item flex flex-col">
            <h3 className="uppercase font-semibold mb-3">Thông tin liên hệ</h3>
            <p className="text-sm text-[#9a9a9a] mb-2">
              <span className="font-bold text-[#000]">Địa chỉ:</span> Tầng 8,
              tòa nhà Ford, số 313 Trường Chinh, quận Thanh Xuân, Hà Nội
            </p>
            <p className="text-sm text-[#9a9a9a] mb-2">
              <span className="font-bold text-[#000]">Email:</span>{" "}
              cdfpt@fpt.edu.vn
            </p>
            <p className="text-sm text-[#9a9a9a]">
              <span className="font-bold text-[#000]">Điện thoại:</span>{" "}
              0987651781
            </p>
          </div>

          {/* Third Column */}
          <div className="info-item flex flex-col">
            <h3 className="uppercase font-semibold mb-3">
              Thời trang nam FSHiRT
            </h3>
            <p className="text-[#9a9a9a]">
              Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và
              thông tin giảm giá khác.
            </p>
            <form className="flex flex-wrap mt-3">
              <div className="relative w-full sm:w-auto flex items-center mb-3 sm:mb-0">
                <Mail className="absolute left-3 text-[#9a9a9a]" />
                <input
                  type="text"
                  placeholder="Nhập email của bạn"
                  className="outline-none border border-[#9a9a9a] py-2 pl-12 pr-3 w-full"
                />
              </div>
              <button
                type="button"
                className="w-full sm:w-auto bg-[#000] text-white px-5 py-2 uppercase"
              >
                Đăng kí
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="info-item flex flex-col">
            <h3 className="uppercase font-semibold mb-3">
              Phương thức thanh toán
            </h3>
            <div className="flex gap-2">
              <img src={vnpay} className="w-[30px]" alt="VNPAY" />
              <img src={zalopay} className="w-[30px]" alt="ZaloPay" />
            </div>
          </div>

          <div className="info-item flex flex-col">
            <h3 className="uppercase font-semibold mb-3">Nhóm liên kết</h3>
            <ul className="text-sm list-disc text-[#9a9a9a] ml-3">
              <li>Giới thiệu</li>
              <li>Tìm kiếm</li>
              <li>Chính sách đổi trả</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          <div className="info-item">
            <img src={listsocial} alt="List" />
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterClient;
