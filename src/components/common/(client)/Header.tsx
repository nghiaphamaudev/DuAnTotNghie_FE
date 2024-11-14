import { Drawer, Dropdown, MenuProps, Space } from "antd";
import {
  AlignJustify,
  ChevronDown,
  CircleUserRound,
  PhoneCall,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoFshirt from "../../../assets/images/logofshirt-rmbg.png";
import { useAuth } from "../../../contexts/AuthContext";
import QuickCart from "./QuickCart";
import { useCart } from "../../../contexts/CartContext";

const HeaderClient = () => {

  // state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  

  // context
  const { cartData } = useCart();
  const { isLogin, handleLogout, user } = useAuth()


  const cartItems = cartData?.items || []
  const totalPrice = cartData?.totalCartPrice ?? 0



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

  const items: MenuProps["items"] = isLogin
    ? [
      {
        key: "1",
        label: "My Account",
        disabled: true,
      },
      {
        key: "2",
        label: <Link to="/my-account">Thông tin cá nhân</Link>,
      },
      {
        key: "3",
        label: "Lịch sử đặt hàng",
      },
      {
        key: "4",
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ]
    : [
      {
        key: "1",
        label: <Link to="/login">Đăng nhập</Link>,
      },
      {
        key: "2",
        label: <Link to="/register">Đăng ký</Link>,
      },
    ];

  // Example cart items and total price
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
              {user && (
                <span className="font-semibold text-sm mr-2"> Xin chào, {user.fullName}</span>
              )}
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
