import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import FooterClient from "../components/common/(client)/Footer";
import HeaderClient from "../components/common/(client)/Header";

const ClientLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Lắng nghe sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra nếu người dùng cuộn hơn 50px thì thay đổi state
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Xóa sự kiện khi component bị huỷ
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="">
      {/* Header cố định */}
      <div
        className={`fixed top-0 left-0 z-50 w-screen flex justify-center items-center transition-colors duration-300 ${
          isScrolled ? "bg-[rgba(255,255,255,0.9)]" : "bg-white"
        }`}
      >
        <div className="">
          <HeaderClient />
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="bg-background-2 mt-[108px]">
        <div className="">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="md:mb-0 mb-20">
        <div className="">
          <FooterClient />
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
