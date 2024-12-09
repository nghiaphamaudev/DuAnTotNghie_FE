import React, { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  CommentOutlined,
  UnorderedListOutlined,
  LockOutlined,
  GiftOutlined,
  TeamOutlined,
  FundOutlined,
  ProfileOutlined,
  SkinOutlined
} from "@ant-design/icons";
import CategoryDropdown from "../../../pages/admin/category/CategoryDropdown";
import { useAuth } from "../../../contexts/AuthContext";

type Props = {
  small: boolean;
};

export default function AdminMenu({ small }: Props) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const { userDataAdmin } = useAuth();

  const handleClickMenu = (e: { key: string }) => {
    const key = e.key;

    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem && React.isValidElement(menuItem.label)) {
      const link = (menuItem.label as React.ReactElement).props.to;
      if (link) {
        if (small) {
          setOpenKeys((prevKeys) => [...prevKeys, key]);
        } else {
          navigate(link.toString());
        }
      }
    }
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleCategorySelect = (id: string) => {
    if (id) {
      navigate(`/admin/category/detail/${id}`);
    } else {
      console.error("Invalid category ID");
    }
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <FundOutlined />,
      label: <Link to="/admin/dashboard">Thống kê</Link>
    },
    {
      key: "bill",
      icon: <ProfileOutlined />,
      label: <Link to="/admin/bill">Đơn hàng</Link>
    },
    {
      key: "product",
      icon: <SkinOutlined />,
      label: <Link to="/admin/product">Sản phẩm</Link>
    },
    {
      key: "category",
      icon: <UnorderedListOutlined />,
      label: <Link to="/admin/category">Danh mục</Link>,
      children: [
        {
          key: "category-dropdown",
          label: (
            <div style={{ width: "120px", justifyContent: "center" }}>
              <CategoryDropdown onSelect={handleCategorySelect} />
            </div>
          )
        }
      ]
    },

    {
      key: "voucher",
      icon: <GiftOutlined />,
      label: <Link to="/admin/voucher">Mã giảm giá</Link>
    },
    ...(userDataAdmin?.role === "superadmin"
      ? [
        {
          key: "users",
          icon: <TeamOutlined />,
          label: <Link to="/admin/users">User</Link>,
        },
      ]
      : []),
    {
      key: "comments",
      icon: <CommentOutlined />,
      label: <Link to="/admin/comments">Bình luận</Link>,
    },
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: <Link to="/admin/change-password">Đổi mật khẩu</Link>,
    },
  ];

  return (
    <Menu
      className="admin-menu"
      mode="inline"

      defaultSelectedKeys={["dashboard"]}
      defaultOpenKeys={openKeys}
      selectedKeys={[]}
      onClick={handleClickMenu}
      onOpenChange={handleOpenChange}
      items={menuItems}
      style={{
        fontSize: "20px",
        fontFamily: 'serif'
      }}
    />
  );
}
