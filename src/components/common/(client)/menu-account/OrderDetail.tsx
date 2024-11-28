import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Descriptions,
  Table,
  Timeline,
  Tag,
  Card,
  Spin,
  Button,
  Modal,
  message
} from "antd";
import {
  getOrderDetailService,
  updateOrderService
} from "../../../../services/orderService";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // Trạng thái mở modal
  const [cancelNote, setCancelNote] = useState(""); // Ghi chú hủy đơn hàng

  const statusColorMap = {
    "Chờ xác nhận": "blue",
    "Đã xác nhận": "green",
    "Đóng gói chờ vận chuyển": "orange",
    "Đang giao hàng": "purple",
    "Đã giao hàng": "cyan",
    "Hoàn thành": "green",
    "Hoàn đơn": "magenta",
    "Đã hủy": "red"
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      if (orderId) {
        const { data } = await getOrderDetailService(orderId);
        setOrderDetail(data);
      }
      setLoading(false);
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  const handleCancelOrder = async () => {
    try {
      const response = await updateOrderService(orderId, "Đã hủy", cancelNote);
      if (response?.status) {
        message.success("Đơn hàng đã được hủy thành công.");
        setOrderDetail((prev) => ({
          ...prev,
          orderInfor: { ...prev.orderInfor, status: "Đã hủy" }
        }));
      } else {
        message.error(response?.message || "Hủy đơn hàng thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    } finally {
      setIsCancelModalOpen(false);
    }
  };

  const {
    orderInfor,
    orderItems,
    historyBill,
    totalPrice,
    shippingCost,
    discountVoucher,
    totalCost,
    createdAt
  } = orderDetail;

  return (
    <div
      style={{
        margin: "30px 20px",
        fontFamily: "'Arial', sans-serif",
        fontSize: "14px"
      }}
    >
      <Link to={"/my-account"}>
        <Button style={{ margin: "10px 0" }}>Quay về</Button>
      </Link>

      {/* Lịch sử đơn hàng */}
      <Card title="Lịch sử đơn hàng">
        <Timeline
          mode="top"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          {historyBill?.map((item, index) => (
            <Timeline.Item
              key={index}
              color={statusColorMap[item.status]}
              style={{
                display: "inline-block",
                textAlign: "center",
                marginRight: "20px"
              }}
            >
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                {item.createdAt}
              </p>
              <p style={{ margin: "5px 0" }}>
                Người xử lý: {item.creator} ({item.role})
              </p>
              <p style={{ margin: "5px 0" }}>
                Trạng thái:{" "}
                <Tag color={statusColorMap[item.status]}>{item.status}</Tag>
              </p>
              {item.note && (
                <p style={{ margin: "5px 0" }}>Ghi chú: {item.note}</p>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      <Card>
        <div className="flex gap-2">
          {orderInfor?.status === "Chờ xác nhận" && (
            <Button
              danger
              onClick={() => setIsCancelModalOpen(true)}
              style={{ margin: "10px 0" }}
            >
              Hủy đơn hàng
            </Button>
          )}
          <Button style={{ margin: "10px 0" }}>
            Xem chi tiết lịch sử đơn hàng
          </Button>
        </div>
      </Card>

      {/* Modal hủy đơn hàng */}
      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={isCancelModalOpen}
        onOk={handleCancelOrder}
        onCancel={() => setIsCancelModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        style={{
          // Màu nền nhẹ nhàng
          borderRadius: "8px", // Bo góc modal
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" // Đổ bóng nhẹ
        }}
        bodyStyle={{
          padding: "20px" // Padding cho body modal
        }}
        titleStyle={{
          backgroundColor: "#ff4d4f", // Màu nền đỏ cho tiêu đề
          color: "white", // Màu chữ trắng
          borderTopLeftRadius: "8px", // Bo góc cho tiêu đề
          borderTopRightRadius: "8px", // Bo góc cho tiêu đề
          fontSize: "16px", // Kích thước chữ tiêu đề
          fontWeight: "bold" // In đậm tiêu đề
        }}
      >
        <p
          style={{
            fontSize: "14px",
            // color: "#555", // Màu chữ tối
            marginBottom: "15px" // Khoảng cách dưới paragraph
          }}
        >
          Bạn có chắc chắn muốn hủy đơn hàng này?
        </p>
        <textarea
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            resize: "vertical", // Cho phép thay đổi chiều cao của textarea
            outline: "none"
          }}
          placeholder="Nhập lý do hủy đơn hàng (không bắt buộc)"
          value={cancelNote}
          onChange={(e) => setCancelNote(e.target.value)}
        />
      </Modal>

      {/* Thông tin đơn hàng */}
      <Card title="Thông tin đơn hàng" style={{ marginBottom: "20px" }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã hóa đơn">
            {orderInfor?.code}
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {orderInfor?.creator}
          </Descriptions.Item>
          <Descriptions.Item label="Người nhận">
            {orderInfor?.receiver}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {orderInfor?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {orderInfor?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            <Tag
              color={
                orderInfor?.paymentMethod === "COD" ? "#2db7f5" : "#87d068"
              }
            >
              {orderInfor?.paymentMethod}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColorMap[orderInfor?.status]}>
              {orderInfor?.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{createdAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card title="Danh sách sản phẩm" style={{ marginBottom: "20px" }}>
        <Table
          rowKey="id"
          dataSource={orderItems}
          pagination={false}
          bordered
          columns={[
            {
              title: "Hình ảnh",
              dataIndex: "image",
              key: "image",
              render: (src) => (
                <img src={src} alt="product" style={{ width: 50 }} />
              )
            },
            { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
            { title: "Màu sắc", dataIndex: "color", key: "color" },
            { title: "Kích thước", dataIndex: "size", key: "size" },
            {
              title: "Đơn giá",
              dataIndex: "price",
              key: "price",
              render: (price) => `${price.toLocaleString()} đ`
            },
            { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
            {
              title: "Tổng tiền",
              dataIndex: "totalItemPrice",
              key: "totalItemPrice",
              render: (price) => `${price.toLocaleString()} đ`
            }
          ]}
        />
      </Card>

      {/* Thông tin thanh toán */}
      <Card title="Thông tin thanh toán" style={{ marginBottom: "20px" }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tổng tiền hàng">{`${totalPrice?.toLocaleString()} đ`}</Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">{`${shippingCost?.toLocaleString()} đ`}</Descriptions.Item>
          <Descriptions.Item label="Voucher giảm giá">{`${discountVoucher?.toLocaleString()} đ`}</Descriptions.Item>
          <Descriptions.Item label="Tổng thanh toán">
            <strong>{`${totalCost?.toLocaleString()} đ`}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderDetail;
