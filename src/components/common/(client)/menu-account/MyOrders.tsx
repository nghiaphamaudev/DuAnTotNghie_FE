import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Tabs, DatePicker, Row, Col } from "antd";
import { getOrdersByUserService } from "../../../../services/orderService";
import { Link } from "react-router-dom";
import { View } from "lucide-react";
import moment from "moment";

const { RangePicker } = DatePicker;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [dateRange, setDateRange] = useState([null, null]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getOrdersByUserService();
      if (response?.data?.orders) {
        const reversedOrders = response.data.orders.reverse();
        setOrders(reversedOrders);
        setFilteredOrders(reversedOrders);
      }
    };
    fetchOrders();
  }, []);

  // Lọc đơn hàng
  const filterOrders = (status, dates) => {
    let filtered = orders;

    // Lọc theo trạng thái
    if (status !== "Tất cả") {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Lọc theo khoảng thời gian
    if (dates && dates[0] && dates[1]) {
      const [startDate, endDate] = dates.map(
        (date) => moment(date, "DD-MM-YYYY") // Chuyển đổi ngày từ RangePicker
      );
      filtered = filtered.filter((order) => {
        const orderDate = moment(order.createdAt, "DD/MM/YYYY HH:mm:ss"); // Chuyển đổi createdAt
        return orderDate.isBetween(startDate, endDate, "day", "[]"); // Bao gồm cả ngày đầu và cuối
      });
    }

    setFilteredOrders(filtered);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    filterOrders(activeTab, dates);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    filterOrders(key, dateRange);
  };

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
      render: (price) => (
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
          "Đã nhận được hàng": "green",
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
          <Link to={`/order-detail/${record.id}`}>
            <Button icon={<View />} type="link">
              Chi tiết
            </Button>
          </Link>
        </Space>
      )
    }
  ];

  const tabItems = [
    { key: "Tất cả", label: "Tất cả" },
    { key: "Chờ xác nhận", label: "Chờ xác nhận" },
    { key: "Đã xác nhận", label: "Đã xác nhận" },
    { key: "Đóng gói chờ vận chuyển", label: "Đóng gói chờ vận chuyển" },
    { key: "Đang giao hàng", label: "Đang giao hàng" },
    { key: "Đã giao hàng", label: "Đã giao hàng" },
    { key: "Đã nhận được hàng", label: "Đã nhận được hàng" },
    { key: "Hoàn đơn", label: "Hoàn đơn" },
    { key: "Đã hủy", label: "Đã hủy" }
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col>
          <RangePicker onChange={handleDateChange} format="DD-MM-YYYY" />
        </Col>
      </Row>
      <Tabs
        defaultActiveKey="Tất cả"
        onChange={handleTabChange}
        items={tabItems.map((tab) => ({
          key: tab.key,
          label: tab.label
        }))}
      />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </>
  );
};

export default MyOrders;
