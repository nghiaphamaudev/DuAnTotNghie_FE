import { Dropdown, MenuProps, Space } from "antd";
import {
  AlignJustify,
  ChevronDown,
  CircleUserRound,
  PhoneCall,
  Search,
  ShoppingBag,
  X
} from "lucide-react";
import { useState } from "react";

const HeaderClient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      disabled: true
    },
    {
      key: "2",
      label: "Thông tin cá nhân"
    },
    {
      key: "3",
      label: "Lịch sử đặt hàng"
    },
    {
      key: "4",
      label: "Đăng xuất"
    }
  ];

  return (
    <div>
      {/* Contact Info */}
      <div className="bg-[#000] w-full hidden text-white py-2 px-16 md:flex justify-between items-center">
        <div className="text-base lg:text-[14px] flex items-center space-x-2">
          <PhoneCall size={18} />
          <span>0988888888</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto px-4 md:px-8 lg:px-16">
        <div className="nav py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="logo flex items-end justify-center md:justify-between mr-2">
            <AlignJustify
              className="size-6 block md:hidden cursor-pointer mr-2 mb-1"
              onClick={toggleMenu}
            />
            <span className="text-bg-3 text-3xl font-semibold">F</span>
            <p className="text-xl font-semibold">Shirt</p>
          </div>

          {/* Navigation Links */}
          <ul className="hidden justify-center items-center space-x-2 md:flex md:space-x-6 lg:space-x-8">
            <li className="block text-[13px] font-semibold whitespace-nowrap">
              <a href="#">Sản phẩm mới</a>
            </li>
            <li className="block text-[13px] font-semibold whitespace-nowrap">
              <a href="#">Sản phẩm hot</a>
            </li>
            <li className="block text-[13px] font-semibold whitespace-nowrap">
              <a href="#">Bộ sưu tập</a>
            </li>
            <li className="block text-[13px] font-semibold whitespace-nowrap">
              <a href="#">Về chúng tôi</a>
            </li>
          </ul>

          {/* Search and Icons */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="w-[180px] md:w-[220px]">
              <form className="flex items-center w-full mx-auto">
                <label htmlFor="voice-search" className="sr-only">
                  Tìm kiếm
                </label>
                <div className="relative w-full flex justify-end">
                  <div className="absolute inset-y-0 end-0 flex items-center pr-3 pointer-events-none">
                    <Search />
                  </div>
                  <input
                    type="text"
                    className="border border-gray-300 text-black text-sm rounded-3xl block w-[80%] ps-5 p-2.5 transition-all duration-300 ease-in-out focus:w-[100%] focus:origin-right dark:bg-[#fff]"
                    placeholder="Tìm kiếm..."
                    required
                  />
                </div>
              </form>
            </div>

            {/* Account and Cart Icons (Desktop) */}
            <div className="hidden md:flex space-x-4 md:space-x-3 items-center ml-2">
              <button className="bg-transparent text-large flex items-center space-x-1">
                <CircleUserRound size={18} />
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      Tài khoản
                      <ChevronDown />
                    </Space>
                  </a>
                </Dropdown>
              </button>

              <button className="bg-transparent text-large flex items-center space-x-1">
                <ShoppingBag size={18} />
                <p>
                  Giỏ hàng <span className="text-danger">(0)</span>
                </p>
              </button>
            </div>

            {/* Account and Cart Icons (Mobile) */}
            <div className="flex md:hidden space-x-4 items-center">
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <CircleUserRound size={20} />
                </a>
              </Dropdown>
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <ul
          className={`fixed top-0 left-0 w-1/2 bg-white h-screen z-50 transition-transform transform ${
            isMenuOpen ? "translate-x-0 h-screen" : "-translate-x-full h-screen"
          } md:hidden`}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <X className="cursor-pointer" size={24} onClick={closeMenu} />
          </div>
          <li className="p-4 text-[14px] border-b">
            <a href="#">Sản phẩm mới</a>
          </li>
          <li className="p-4 text-[14px] border-b">
            <a href="#">Sản phẩm hot</a>
          </li>
          <li className="p-4 text-[14px] border-b">
            <a href="#">Bộ sưu tập</a>
          </li>
          <li className="p-4 text-[14px] border-b">
            <a href="#">Về chúng tôi</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderClient;
