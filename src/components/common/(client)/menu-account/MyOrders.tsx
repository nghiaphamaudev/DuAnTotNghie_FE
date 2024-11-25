import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  Modal,
  Row,
  Space,
  Tabs,
  Typography
} from "antd";
import { MessageSquarePlus, Store } from "lucide-react";
import { Link } from "react-router-dom";

const { Text } = Typography;

const MyOrders = () => {
  const orders = [
    {
      id: 1,
      shopName: "Nasalee",
      status: "Hoàn thành",
      image:
        "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lyhl5wmxus1f6c.webp",
      productName: "Nasa Khớp Ngắn Tay Nam Nữ Xu Hướng Thời Trang Mùa Hè 2024",
      variant: "Áo nam nữ",
      priceOriginal: "₫280.000",
      priceFinal: "₫186.000",
      quantity: 1,
      totalPrice: "₫186.000",
      actions: ["Yêu Cầu Trả Hàng/Hoàn Tiền"],
      reviewDate: "13-12-2024",
      pointsEarned: 200
    },
    {
      id: 2,
      shopName: "JBAGY OFFICIAL",
      status: "Đã hủy",
      image:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqyje5afzlw95a.webp",
      productName: "Áo sơ mi nam tay dài JBAGY Pastel sơ mi trắng form rộng",
      variant: "Áo sơ mi nam",
      priceOriginal: "₫169.000",
      priceFinal: "₫150.000",
      quantity: 1,
      totalPrice: "₫150.000",
      actions: ["Yêu Cầu Trả Hàng/Hoàn Tiền"]
    }
  ];

  const [activeStatus, setActiveStatus] = useState<string>("Tất cả");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Các trạng thái đơn hàng
  const statuses = [
    "Tất cả",
    "Chờ thanh toán",
    "Vận chuyển",
    "Chờ giao hàng",
    "Hoàn thành",
    "Đã hủy",
    "Trả hàng/Hoàn tiền"
  ];

  // Lọc đơn hàng dựa trên trạng thái
  const filteredOrders =
    activeStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === activeStatus);

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const renderActions = (actions: string[], order: any) => (
    <Space>
      {actions.map((action, index) => (
        <button
          className="px-5 py-2 bg-[#2AB573] text-white"
          key={index}
          onClick={() => handleOpenModal(order)}
        >
          {action}
        </button>
      ))}
    </Space>
  );

  return (
    <div className="my-orders">
      {/* Header Tabs */}
      <Tabs defaultActiveKey="Tất cả" onChange={(key) => setActiveStatus(key)}>
        {statuses.map((status) => (
          <Tabs.TabPane tab={status} key={status} />
        ))}
      </Tabs>

      {/* Order List */}
      <div className="order-list">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            title={
              <Row justify="space-between">
                <Col>
                  <Space>
                    <Text strong>{order.shopName}</Text>
                    <Button
                      icon={<MessageSquarePlus />}
                      size="small"
                      type="text"
                    >
                      Thêm đánh giá
                    </Button>
                    <Button icon={<Store />} size="small" type="text">
                      Xem Shop
                    </Button>
                  </Space>
                </Col>
                <Col>
                  <Text
                    type={order.status === "Hoàn thành" ? "success" : "danger"}
                  >
                    {order.status}
                  </Text>
                </Col>
              </Row>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <Image src={order.image} alt={order.productName} />
              </Col>
              <Col span={20}>
                <Space direction="vertical" size="small">
                  <Link
                    to={`/order-detail/${order.id}`}
                    style={{ fontWeight: "bold" }}
                  >
                    {order.productName}
                  </Link>
                  <Text>Phân loại hàng: {order.variant}</Text>
                  <Row justify="space-between">
                    <Text delete>{order.priceOriginal}</Text>
                    <Text strong>{order.priceFinal}</Text>
                  </Row>
                  <Row justify="space-between">
                    <Text>x{order.quantity}</Text>
                    <Text strong>{order.totalPrice}</Text>
                  </Row>
                  {order.reviewDate && (
                    <Text type="secondary">
                      Đánh giá sản phẩm trước {order.reviewDate} để nhận{" "}
                      {order.pointsEarned} Xu
                    </Text>
                  )}
                  <div>{renderActions(order.actions, order)}</div>
                </Space>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        title="Yêu Cầu Trả Hàng/Hoàn Tiền"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary">
            Gửi yêu cầu
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Sản phẩm:</strong> {selectedOrder.productName}
            </p>
            <p>
              <strong>Giá:</strong> {selectedOrder.priceFinal}
            </p>
            <p>
              <strong>Lý do trả hàng:</strong>
            </p>
            <textarea
              rows={4}
              style={{ width: "100%", resize: "none", padding: "8px" }}
              placeholder="Nhập lý do trả hàng..."
            ></textarea>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;
