import React, { useState } from "react";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileDoneOutlined,
  UserOutlined,
  CommentOutlined,
  ProductOutlined,
  UnorderedListOutlined,
  FontSizeOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import CategoryDropdown from "../../../pages/admin/category/CategoryDropdown";

type Props = {
  small: boolean;
};

export default function AdminMenu({ small }: Props) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();

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
    console.log("Selected category ID:", id);
    navigate(`/admin/category/detail/${id}`);
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Thống kê</Link>,
    },
    {
      key: "bill",
      icon: <FileDoneOutlined />,
      label: <Link to="/admin/bill">Đơn hàng</Link>,
    },
    {
      key: "product",
      icon: <ProductOutlined />,
      label: <Link to="/admin/product">Sản phẩm</Link>,
    },
    {
      key: "category",
      icon: <UnorderedListOutlined />,
      label: <Link to="/admin/category">Danh mục</Link>,
      children: [
        {
          key: "category-dropdown",
          label: (
            <div style={{ padding: "0 16px" }}>
              <CategoryDropdown onSelect={handleCategorySelect} />
            </div>
          ),
        },
      ],
    },
    {
      key: "size",
      icon: <FontSizeOutlined />,
      label: <Link to="/admin/size">Kích cỡ</Link>,
    },
    {
      key: "voucher",
      icon: <GiftOutlined />,
      label: <Link to="/admin/voucher">Mã giảm giá</Link>,
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">User</Link>,
    },
    {
      key: "comments",
      icon: <CommentOutlined />,
      label: <Link to="/admin/comments">Bình luận</Link>,
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
      }}
    />
  );
}
