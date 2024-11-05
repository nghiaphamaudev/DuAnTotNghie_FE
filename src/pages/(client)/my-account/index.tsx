import {
  EditOutlined,
  EyeOutlined,
  GiftOutlined,
  HeartOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Card, Menu } from "antd";
import React, { useEffect, useState } from "react"; // Đảm bảo import React
import PromoCode from "./PromoCode";
import MyOrders from "./MyOrders";
import Address from "./Address";
import Favorite from "./Favorite";
import ViewHistoty from "./ViewHistoty";
import ResetPassword from "./ResetPassword";

import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

type MenuItemKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

const MenuAccount = () => {
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(
    <UserProfile />
  );
  const { handleLogout, isLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (key: MenuItemKey) => {
    switch (key) {
      case "1":
        setCurrentContent(<PromoCode />);
        break;
      case "2":
        setCurrentContent(<MyOrders />);
        break;
      case "3":
        setCurrentContent(<Address />);
        break;
      case "4":
        setCurrentContent(<Favorite />);
        break;
      case "5":
        setCurrentContent(<ViewHistoty />);
        break;
      case "6":
        setCurrentContent(<ResetPassword />);
        break;
      case "7":
        handleLogout();
        break;
      case "8":
        setCurrentContent(<UserProfile />);
        break;
      default:
        setCurrentContent(<UserProfile />);
    }
  };

  // useEffect(() => {
  //   if (!isLogin) {
  //     navigate("/login"); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
  //   }
  // }, [isLogin, navigate]);
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="grid grid-cols-12 gap-4 w-full max-w-7xl">
        <div className="col-span-12 md:col-span-3 bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {user && (
                  <span className="font-semibold text-sm mr-2">
                    {user.fullName}
                  </span>
                )}
              </span>
              <EditOutlined
                onClick={() => handleMenuClick("8")}
                className="ml-2 text-green-500 cursor-pointer "
              />
            </div>
          </div>

          <div className="text-white rounded-lg p-4 flex justify-between items-center mb-6">
            <Card
              className="rounded-lg shadow-md w-full max-w-md lg:max-w-lg xl:max-w-xl"
              style={{ background: "linear-gradient(90deg, #2AB573, #3BA875)" }}
            >
              <div className="flex justify-between text-white">
                <div>
                  <p className="text-sm font-medium">Hạng thẻ</p>
                  <p className="text-lg font-bold">BRONZE</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">KHTT</p>
                  <p className="text-lg font-bold">0</p>
                </div>
              </div>
              <div className="flex justify-between text-white mt-4">
                <span className="text-sm">0 / 200</span>
                <span className="text-sm">Gold</span>
              </div>
              <div className="mt-2 bg-white rounded-lg h-1"></div>
            </Card>
          </div>

          <Menu
            mode="vertical"
            className="border-none"
            items={[
              {
                key: "1",
                icon: <GiftOutlined />,
                label: "Mã ưu đãi",
                onClick: () => handleMenuClick("1"),
              },
              {
                key: "2",
                icon: <ShoppingCartOutlined />,
                label: "Đơn hàng",
                onClick: () => handleMenuClick("2"),
              },
              {
                key: "3",
                icon: <HomeOutlined />,
                label: "Sổ địa chỉ",
                onClick: () => handleMenuClick("3"),
              },
              {
                key: "4",
                icon: <HeartOutlined />,
                label: "Yêu thích",
                onClick: () => handleMenuClick("4"),
              },
              {
                key: "5",
                icon: <EyeOutlined />,
                label: "Đã xem gần đây",
                onClick: () => handleMenuClick("5"),
              },
              {
                key: "6",
                icon: <LockOutlined />,
                label: "Đổi mật khẩu",
                onClick: () => handleMenuClick("6"),
              },
              {
                key: "7",
                icon: <LogoutOutlined />,
                label: "Đăng xuất",
                onClick: () => handleMenuClick("7"),
              },
            ]}
          />
        </div>

        <div className="col-span-12 md:col-span-9 bg-white shadow-lg rounded-lg p-6 ">
          <div className="text-2xl font-bold">{currentContent}</div>
        </div>
      </div>
    </div>
  );
};

export default MenuAccount;