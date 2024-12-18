import { Button, Dropdown, Menu, Space, Table, Tabs, Tag } from "antd";
import { View } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import {
  getAllOrdersServiceForAdmin,
  getAllOrdersServiceForSuperAdmin
} from "../../../services/orderService";
import { useDebounce } from "../../../hooks/useDebounce"; // Import hook useDebounce
import { DownOutlined } from "@ant-design/icons";
import { socket } from "../../../socket";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State cho giá trị tìm kiếm
  const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách đơn hàng đã lọc
  const [filterByAssigned, setFilterByAssigned] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả"); // Tab hiện tại
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Sử dụng debounce với delay 300ms

  const user = localStorage.getItem("useradmin");
  const userRole = JSON.parse(user)?.role;
  const fetchOrders = async () => {
    let response;
    if (userRole === "superadmin") {
      response = await getAllOrdersServiceForSuperAdmin();
      console.log("responseAdminSP: ", response.data);
    } else if (userRole === "admin") {
      response = await getAllOrdersServiceForAdmin();
    }
    console.log("response+++=: ", response.data);

    if (response?.data) {
      setOrders(response.data.reverse());
      setFilteredOrders(response.data);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    // Lắng nghe sự kiện từ socket
    const handleCreateOrder = async (idAdmin: string) => {
      console.log("Create order event detected, refetching orders...");
      if (idAdmin === JSON.parse(user)._id) {
        fetchOrders();
      }
    };

    socket.on("create order", (idAdmin) => handleCreateOrder(idAdmin));

    // Cleanup khi component unmount
    return () => {
      socket.off("create order", handleCreateOrder);
    };
  }, []);

  // Lọc danh sách theo tìm kiếm
  useEffect(() => {
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        (order?.code.toLowerCase().trim().includes(lowercasedQuery) ||
          order?.receiver.toLowerCase().trim().includes(lowercasedQuery)) &&
        (filterByAssigned
          ? order?.assignedTo?.fullName === filterByAssigned
          : true) // Lọc theo người phụ trách
    );
    setFilteredOrders(filtered);
  }, [debouncedSearchQuery, orders, filterByAssigned]);

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
      width: 200,
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
      width: 150,
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
    ...(userRole === "superadmin"
      ? [
          {
            title: "Người phụ trách",
            dataIndex: "assignedTo",
            key: "assignedTo",
            width: 150,
            render: (assignedTo) => (
              <span style={{ fontWeight: "500" }}>
                {assignedTo?.fullName || "Superadmin"}
              </span>
            )
          }
        ]
      : []),
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

  // Menu cho dropdown
  const menuItems = orders.reduce((acc, order) => {
    if (
      order.assignedTo?.fullName &&
      !acc.some((item) => item.label === order.assignedTo.fullName)
    ) {
      acc.push({
        key: order?.assignedTo?.fullName,
        label: order?.assignedTo?.fullName
      });
    }
    return acc;
  }, []);

  const menu = (
    <Menu
      items={menuItems.map((item) => ({
        key: item.key,
        label: item.label
      }))}
      onClick={(info) => {
        setFilterByAssigned(info.key); // Cập nhật giá trị bộ lọc
      }}
    />
  );

  return (
    <>
      <BreadcrumbsCustom nameHere={"Đơn hàng"} listLink={[]} />
      <div className="flex items-start justify-start gap-4">
        <div className="relative mb-4 w-3/4">
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
        {JSON.parse(user)?.role === "superadmin" && (
          <div className="flex items-center gap-4">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button style={{ padding: "18px 10px" }}>
                {filterByAssigned
                  ? `Lọc theo: ${filterByAssigned}`
                  : "Đơn hàng phân công theo admin"}{" "}
                <DownOutlined />
              </Button>
            </Dropdown>
            {filterByAssigned && (
              <Button
                type="default"
                onClick={() => setFilterByAssigned("")} // Xóa bộ lọc
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
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
