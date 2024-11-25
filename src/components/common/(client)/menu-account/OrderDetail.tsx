import React from "react";
import { Typography, Steps, Card, Table, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { OrderDetail } from "../../../../interface/Order";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

interface OrderDetailProps {
  data: OrderDetail;
}

// Dữ liệu giả được định nghĩa ngay trong file
export const mockOrderDetail: OrderDetail = {
  orderId: "241107HTPYP2QV",
  status: "Đánh Giá",
  timeline: [
    { time: "00:20 07-11-2024", description: "Đơn hàng đã đặt" },
    {
      time: "00:50 07-11-2024",
      description: "Đã xác nhận thông tin thanh toán"
    },
    { time: "16:50 07-11-2024", description: "Đã giao cho ĐVVC" },
    { time: "09:40 11-11-2024", description: "Đã nhận được hàng" }
  ],
  deliveryDate: "11:11 09-11-2024",
  customerInfo: {
    name: "Vuong Dinh Linh",
    phone: "+84 971207241",
    address: "Thôn 2 Tân Hòa, Xã Tân Hòa, Huyện Quốc Oai, Hà Nội"
  },
  shippingProvider: {
    name: "SPX Express",
    trackingCode: "SPXVN04803945948"
  },
  products: [
    {
      id: "1",
      name: "Nasa Khớp Ngắn Tay Nam Nữ Xu Hướng Thời Trang Mùa Hè 2024",
      price: 185000,
      originalPrice: 280000,
      discount: 28,
      quantity: 1,
      imageUrl:
        "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lyhl5wmxus1f6c.webp"
    }
  ],
  totalPrice: 185000
};

const OrderDetail: React.FC<OrderDetailProps> = ({ data }) => {
  const { orderId } = useParams();
  if (!mockOrderDetail) {
    return <div>Không tìm thấy dữ liệu đơn hàng!</div>;
  }
  console.log(orderId);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (text: string, record: { imageUrl: string }) => (
        <div className="flex items-center">
          <img
            src={record.imageUrl}
            alt={text}
            className="w-16 h-16 object-cover rounded mr-4"
          />
          <span>{text}</span>
        </div>
      )
    },
    { title: "Số lượng", dataIndex: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (price: number) => `${price.toLocaleString()}đ`
    },
    {
      title: "Tổng",
      render: (record: { price: number; quantity: number }) =>
        `${(record.price * record.quantity).toLocaleString()}đ`
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Title level={3}>Mã Đơn Hàng: {orderId}</Title>
      <Steps current={data.timeline.length - 1} progressDot className="mb-6">
        {data.timeline.map((step, index) => (
          <Steps.Step
            key={index}
            title={step.description}
            description={step.time}
          />
        ))}
      </Steps>

      <Card title="Địa Chỉ Nhận Hàng" className="mb-6">
        <Text strong>{data.customerInfo.name}</Text>
        <br />
        <Text>{data.customerInfo.phone}</Text>
        <br />
        <Text>{data.customerInfo.address}</Text>
      </Card>

      <Card title="Thông Tin Vận Chuyển" className="mb-6">
        <Text>
          {data.shippingProvider.name} - Mã vận đơn:{" "}
          {data.shippingProvider.trackingCode}
        </Text>
      </Card>

      <Card title="Sản Phẩm" className="mb-6">
        <Table
          columns={columns}
          dataSource={data.products}
          pagination={false}
          rowKey="id"
        />
        <div className="flex justify-end mt-4">
          <Text strong>Tổng tiền: {data.totalPrice.toLocaleString()}đ</Text>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="primary" icon={<CheckCircleOutlined />}>
          Đánh Giá
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
