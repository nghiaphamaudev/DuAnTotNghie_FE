import { Button, Space, Table, Tabs, Tag } from "antd";
import { View } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { getAllOrdersServiceForAdmin } from "../../../services/orderService";
import { useDebounce } from "../../../hooks/useDebounce"; // Import hook useDebounce

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State cho giá trị tìm kiếm
  const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách đơn hàng đã lọc
  const [activeTab, setActiveTab] = useState("Tất cả"); // Tab hiện tại
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Sử dụng debounce với delay 300ms

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getAllOrdersServiceForAdmin();
      if (response?.data) {
        setOrders(response.data.reverse());
        setFilteredOrders(response.data);
      }
    };
    fetchOrders();
  }, []);

  // Lọc danh sách theo tìm kiếm
  useEffect(() => {
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.code.toLowerCase().trim().includes(lowercasedQuery) || // Tìm theo mã hóa đơn
        order.receiver.toLowerCase().trim().includes(lowercasedQuery) // Tìm theo tên khách hàng
    );
    setFilteredOrders(filtered);
  }, [debouncedSearchQuery, orders]);

  // Lọc đơn hàng theo trạng thái
  const filterByStatus = (status) => {
    if (status === "Tất cả") return orders; // Hiển thị tất cả đơn hàng
    return orders.filter((order) => order.status === status);
  };

  // Cập nhật dữ liệu khi thay đổi tab
  useEffect(() => {
    const updatedOrders = filterByStatus(activeTab);
    setFilteredOrders(updatedOrders);
  }, [activeTab, orders]);

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
      dataIndex: "receiver",
      key: "receiver",
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
      render: (text) => {
        const formattedDate = new Date(text).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        return <span style={{ fontWeight: "400" }}>{formattedDate}</span>;
      }
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
          <Link to={`${record._id}`}>
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
    { key: "Đóng gói chờ vận chuyển", label: "Đóng gói" },
    { key: "Đang giao hàng", label: "Đang giao" },
    { key: "Đã giao hàng", label: "Đã giao" },
    { key: "Hoàn đơn", label: "Hoàn đơn" },
    { key: "Đã hủy", label: "Đã hủy" }
  ];

  return (
    <>
      <BreadcrumbsCustom nameHere={"Đơn hàng"} listLink={[]} />

      <div className="relative mb-4">
        <label htmlFor="Search" className="sr-only">
          Search
        </label>

        <input
          type="text"
          id="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị tìm kiếm
          placeholder="Tìm kiếm theo mã hóa đơn hoặc tên khách hàng..."
          className="w-full rounded-md border-gray-200 py-2.5 ps-4 pe-10 shadow-sm sm:text-sm"
        />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems.map((tab) => ({
          key: tab.key,
          label: tab.label,
          children: (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredOrders}
              pagination={{ pageSize: 10 }}
              bordered
              scroll={{ x: "max-content" }}
            />
          )
        }))}
      />
    </>
  );
};

export default Orders;
