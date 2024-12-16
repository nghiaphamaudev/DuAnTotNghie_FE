import { useQuery } from "@tanstack/react-query"; 
import { Table, Tag } from "antd";
import { getAllOrdersByUserId } from "../../../services/orderService";

const OrdersTable = (userId:string) => {
  
  const {
    data: userDataOrder,
  } = useQuery({
    queryKey: ["userDataAdmin", userId],
    queryFn: async () => {
      if (!userId) throw new Error("UserId không tồn tại");
      const res = await getAllOrdersByUserId(userId.userId);
      return res.data.orders;
    },
    enabled: !!userId,
  });
  
  const columnOrders = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "creator",
      key: "creator",
      width: 150,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 120,
      render: (price) => (
        <span style={{ fontWeight: "500" }}>
          {`${price.toLocaleString()} đ`}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
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
          "Đã hủy": "red",
        };
        return (
          <Tag color={colorMap[status]} style={{ fontWeight: "500" }}>
            {status}
          </Tag>
        );
      },
    },
  ];
  return (
    <Table
      columns={columnOrders}
      dataSource={userDataOrder}
      rowKey={(record) => record.code} 
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrdersTable;
