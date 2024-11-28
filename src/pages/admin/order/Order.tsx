import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Tabs, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Search, View } from "lucide-react";
import { getOrdersByUserService } from "../../../services/orderService";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrdersByUserService();
      console.log("orders: ", response);

      if (response?.data?.orders) {
        setOrders(response.data.orders);
      }
    };
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 50
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text) => <span style={{ fontWeight: "500" }}>{text}</span>
    },
    {
      title: "Tên khách hàng",
      dataIndex: "creator",
      key: "creator",
      width: 150,
      render: (text) => <span style={{ fontWeight: "500" }}>{text}</span>
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (price: number) => (
        <span
          style={{ fontWeight: "500" }}
        >{`${price.toLocaleString()} đ`}</span>
      )
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (text) => <span style={{ fontWeight: "400" }}>{text}</span>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const colorMap = {
          "Chờ xác nhận": "blue",
          "Đã xác nhận": "green",
          "Đóng gói chờ vận chuyển": "orange",
          "Đang giao hàng": "purple",
          "Đã giao hàng": "cyan",
          "Hoàn thành": "green",
          "Hoàn đơn": "magenta",
          "Đã hủy": "red"
        };
        return (
          <Tag color={colorMap[status]} style={{ fontWeight: "500" }}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "id",
      width: 150,
      render: (_, record) => (
        <Space>
          <Link to={`${record.id}`}>
            <Button icon={<View />} type="link">
              Chi tiết
            </Button>
          </Link>
        </Space>
      )
    }
  ];

  const filterOrdersByStatus = (status: string) =>
    status === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === status);

  const tabItems = [
    { key: "Tất cả", label: "Tất cả" },
    { key: "Chờ xác nhận", label: "Chờ xác nhận" },
    { key: "Đã xác nhận", label: "Đã xác nhận" },
    { key: "Đóng gói chờ vận chuyển", label: "Đóng gói chờ vận chuyển" },
    { key: "Đang giao hàng", label: "Đang giao hàng" },
    { key: "Đã giao hàng", label: "Đã giao hàng" },
    { key: "Hoàn thành", label: "Hoàn thành" },
    { key: "Hoàn đơn", label: "Hoàn đơn" },
    { key: "Đã hủy", label: "Đã hủy" }
  ];

  return (
    <>
      <BreadcrumbsCustom nameHere={"Đơn hàng"} listLink={[]} />
      <Tabs
        defaultActiveKey="Tất cả"
        items={tabItems.map((tab) => ({
          key: tab.key,
          label: tab.label,
          children: (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filterOrdersByStatus(tab.key)}
              pagination={{ pageSize: 5 }}
              bordered
            />
          )
        }))}
      />
    </>
  );
};

export default Orders;
