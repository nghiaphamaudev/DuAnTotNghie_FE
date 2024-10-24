import { Dropdown, MenuProps, Space, Drawer } from "antd";
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
import { Link } from "react-router-dom";
import LogoFshirt from "../../../assets/images/logofshirt-rmbg.png";
import QuickCart from "./QuickCart";

const HeaderClient = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setIsCartDrawerOpen(!isCartDrawerOpen);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const closeNavDrawer = () => {
    setIsDrawerOpen(false);
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

  // Example cart items and total price
  const cartItems = [
    {
      id: "1",
      name: "ÁO POLO DÀI TAY BASIC FWTP065",
      price: 299000,
      discountPrice: 450000,
      imageUrl:
        "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_master.png",
      size: "S",
      color: "Nâu nhạt",
      quantity: 1
    }
  ];
  const totalPrice = 299000;
  const freeShippingThreshold = 500000;

  return (
    <div className="w-full">
      {/* Contact Info */}
      <div className="bg-[#000] w-screen hidden text-white py-2 px-16 md:flex justify-between items-center">
        <div className="text-base lg:text-[14px] flex items-center space-x-2">
          <PhoneCall size={18} />
          <span>0988888888</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto px-4 md:px-8 lg:px-16">
        <div className="nav py-2 flex items-center justify-between">
          {/* Logo and Mobile Menu Icon */}
          <div className="logo flex items-center justify-between">
            <AlignJustify
              className="block md:hidden cursor-pointer w-20 mb-1"
              onClick={toggleDrawer}
            />
            <Link to="/home">
              <img src={LogoFshirt} className="w-[100px]" alt="Logo" />
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <ul className="hidden justify-center items-center space-x-2 md:flex md:space-x-6 lg:space-x-8">
            <li className="block text-[15px] font-semibold whitespace-nowrap">
              <a href="#">Sản phẩm mới</a>
            </li>
            <li className="block text-[15px] font-semibold whitespace-nowrap">
              <a href="#">Sản phẩm hot</a>
            </li>
            <li className="block text-[15px] font-semibold whitespace-nowrap">
              <a href="#">Bộ sưu tập</a>
            </li>
            <li className="block text-[15px] font-semibold whitespace-nowrap">
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

            {/* Account and Cart Icons (visible in all views) */}
            <div className="flex space-x-4 md:space-x-3 items-center ml-2">
              {/* Account */}
              <button className="bg-transparent text-large flex items-center space-x-1">
                <CircleUserRound size={18} />
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="font-semibold text-sm">
                      <ChevronDown size={16} />
                    </Space>
                  </a>
                </Dropdown>
              </button>

              {/* Cart */}
              <button
                className="bg-transparent flex items-center"
                onClick={toggleCartDrawer}
              >
                <ShoppingBag size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeNavDrawer}
        open={isDrawerOpen}
        closeIcon={<X size={24} />}
      >
        <ul className="flex flex-col space-y-4">
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <a href="#">Sản phẩm mới</a>
          </li>
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <a href="#">Sản phẩm hot</a>
          </li>
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <a href="#">Bộ sưu tập</a>
          </li>
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <a href="#">Về chúng tôi</a>
          </li>
        </ul>
      </Drawer>

      {/* QuickCart Component (Always accessible outside of drawer) */}
      <QuickCart
        isCartDrawerOpen={isCartDrawerOpen}
        closeCartDrawer={closeCartDrawer}
        cartItems={cartItems}
        totalPrice={totalPrice}
        freeShippingThreshold={freeShippingThreshold}
      />
    </div>
  );
};

export default HeaderClient;
