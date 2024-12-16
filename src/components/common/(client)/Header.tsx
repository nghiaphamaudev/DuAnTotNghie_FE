import { Badge, Drawer, Dropdown, MenuProps, Space } from "antd";
import {
  AlignJustify,
  ChevronDown,
  CircleUserRound,
  PhoneCall,
  Search,
  ShoppingBag,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoFshirt from "../../../assets/images/logofshirt-rmbg.png";
import { useAuth } from "../../../contexts/AuthContext";
import QuickCart from "./QuickCart";
import { useCart } from "../../../contexts/CartContext";
import { useProduct } from "../../../contexts/ProductContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useCategory } from "../../../contexts/CategoryContext";

const HeaderClient = () => {
  // State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const toggleCollectionDropdown = () =>
    setIsCollectionOpen((prevState) => !prevState);
  const queryClient = useQueryClient();
  const { allCategory } = useCategory();
  const navigate = useNavigate();
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Context
  const { cartData, countItemCart } = useCart();
  const { isLogin, showLogoutModal, user } = useAuth();
  const { allProduct } = useProduct();

  const cartItems = cartData?.items || [];
  const totalPrice = cartData?.totalCartPrice ?? 0;

  // Toggle Drawer
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleCartDrawer = () => setIsCartDrawerOpen(!isCartDrawerOpen);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);
  const closeNavDrawer = () => setIsDrawerOpen(false);

  // Search functionality
  useEffect(() => {
    if (debouncedSearchTerm) {
      const results = allProduct.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [debouncedSearchTerm, allProduct]);
  useEffect(() => {
    // Invalidate cart query to refresh cart state
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, []);

  // Menu items
  const items: MenuProps["items"] = isLogin
    ? [
        {
          key: "2",
          label: <Link to="/my-account">Thông tin cá nhân</Link>
        },
        {
          key: "5",
          label: "Đăng xuất",
          onClick: showLogoutModal
        }
      ]
    : [
        {
          key: "1",
          label: <Link to="/login">Đăng nhập</Link>
        },
        {
          key: "2",
          label: <Link to="/register">Đăng ký</Link>
        }
      ];

  return (
    <div className="w-full">
      {/* Contact Info */}
      <div className="bg-[#000] w-screen hidden text-white py-2 px-16 md:flex justify-between items-center">
        <div className="text-base lg:text-[14px] flex items-center space-x-2">
          <PhoneCall size={18} />
          <span>0984282598</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto  md:px-8 lg:px-16">
        <div className="nav py-2 pr-3 flex items-center justify-between gap-2">
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
              <Link to="/home">Trang chủ</Link>
            </li>
            <li className="block text-[15px] font-semibold whitespace-nowrap">
              <Link to="/product">Sản phẩm</Link>
            </li>
            <li className="relative group">
              <button className="text-sm font-medium flex items-center space-x-1 hover:text-gray-500">
                <span className="block text-[15px] font-semibold whitespace-nowrap">
                  Bộ sưu tập
                </span>
                <ChevronDown size={16} />
              </button>
              <ul className="absolute hidden group-hover:block group-focus-within:block bg-white text-gray-700 shadow-md rounded-lg mt-2 py-2 w-96 transition-opacity duration-300 ">
                {allCategory.length > 0 &&
                  allCategory.map((cateItem) => (
                    <li
                      key={cateItem.id}
                      onClick={() =>
                        navigate(`/product?category=${cateItem.id}`)
                      }
                    >
                      <a className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer">
                        {cateItem.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </li>
            <li className="block text-[15px] font-semibold whitespace-nowrap">
              <Link to="/aboutus">Về chúng tôi</Link>
            </li>
          </ul>

          {/* Search and Icons */}
          <div className="flex items-center justify-between w-full md:w-auto ">
            {/* Search Bar */}
            <div className="w-[180px] md:w-[220px] relative ">
              <div className="absolute inset-y-0 start-1 flex items-center pr-5 pointer-events-none w-16 text-black opacity-100">
                <Search />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300  text-black text-sm rounded-3xl block w-[100%] ps-8 p-2 transition-all duration-300 ease-in-out focus:w-[100%] focus:origin-right dark:bg-[#fff]"
              />
              {filteredProducts.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-2 w-full max-h-48 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <li
                      key={product?.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-500"
                      S
                    >
                      <Link to={`/home/product/${product?.id}`}>
                        {product?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {filteredProducts.length === 0 && debouncedSearchTerm && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-2 w-full p-2 text-sm text-gray-500 italic">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>

            {/* Account and Cart Icons */}
            <div className="flex space-x-4 md:space-x-3 items-center ml-2">
              {/* Account */}
              {user && (
                <span className="font-semibold text-sm mr-2">
                  Xin chào, {user.fullName}
                </span>
              )}
              <Dropdown menu={{ items }} trigger={["click"]}>
                <button className="bg-transparent text-large flex items-center space-x-1">
                  <CircleUserRound size={18} />
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="font-semibold text-sm">
                      <ChevronDown size={16} />
                    </Space>
                  </a>
                </button>
              </Dropdown>

              {/* Cart */}
              <button
                className="bg-transparent flex items-center"
                onClick={toggleCartDrawer}
              >
                <Badge count={countItemCart}>
                  <ShoppingBag size={22} />
                </Badge>
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
            <Link to="/home">Trang chủ</Link>
          </li>
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <Link to="/product">Sản phẩm mới</Link>
          </li>
          {/* Bộ sưu tập */}
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <div
              onClick={toggleCollectionDropdown}
              className="flex justify-between items-center cursor-pointer"
            >
              Bộ sưu tập
              <ChevronDown size={16} />
            </div>
            {isCollectionOpen && (
              <ul className="mt-2 space-y-2 pl-4">
                {allCategory.length > 0 &&
                  allCategory.map((cateItem) => (
                    <li
                      key={cateItem.id}
                      onClick={() => {
                        navigate(`/product?category=${cateItem.id}`);
                        closeNavDrawer(); // Đóng Drawer sau khi chọn
                      }}
                      className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                    >
                      {cateItem.name}
                    </li>
                  ))}
              </ul>
            )}
          </li>
          <li className="block text-[15px] font-semibold whitespace-nowrap">
            <Link to="/aboutus">Về chúng tôi</Link>
          </li>
        </ul>
      </Drawer>

      {/* QuickCart Component */}
      <QuickCart
        isCartDrawerOpen={isCartDrawerOpen}
        closeCartDrawer={closeCartDrawer}
        cartItems={cartItems}
        totalPrice={totalPrice}
        freeShippingThreshold={500000}
      />
    </div>
  );
};

export default HeaderClient;
