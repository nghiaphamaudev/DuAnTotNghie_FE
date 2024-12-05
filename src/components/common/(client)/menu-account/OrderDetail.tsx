import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Descriptions,
  Table,
  Timeline,
  Tag,
  Card,
  Spin,
  Button,
  Modal,
  Input,
  message
} from "antd";
import {
  getOrderDetailService,
  updateOrderService
} from "../../../../services/orderService";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnNote, setReturnNote] = useState("");

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

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      if (orderId) {
        const { data } = await getOrderDetailService(orderId);
        if (data) {
          setOrderDetail(data);
        } else {
          message.error(
            "Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau."
          );
          navigate("/my-account");
        }
      }
    } catch (error) {
      message.error("Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      const response = await updateOrderService(orderId, "Đã hủy", cancelNote);
      if (response?.status) {
        message.success("Đơn hàng đã được hủy thành công.");
        await fetchOrderDetail();
      } else {
        message.error(response?.message || "Hủy đơn hàng thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    } finally {
      setIsCancelModalOpen(false);
    }
  };

  const handleReturnOrder = async () => {
    try {
      const response = await updateOrderService(
        orderId,
        "Hoàn đơn",
        returnNote
      );
      if (response?.status) {
        message.success("Đơn hàng đã được hoàn thành công.");
        await fetchOrderDetail();
      } else {
        message.error(response?.message || "Hoàn đơn hàng thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hoàn đơn hàng.");
    } finally {
      setIsReturnModalOpen(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

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

      <Card title="Lịch sử đơn hàng">
        <Timeline
          mode="top"
          style={{
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
            padding: "10px 0"
          }}
        >
          {historyBill?.map((item, index) => (
            <Timeline.Item
              key={index}
              color={statusColorMap[item.status]}
              style={{
                display: "inline-block",
                textAlign: "center",
                width: "250px",
                marginRight: "20px"
              }}
            >
              <p>
                <strong>{item.createdAt}</strong>
              </p>
              <p>
                Người xử lý: {item.creator} ({item.role})
              </p>
              <p>
                Trạng thái:{" "}
                <Tag color={statusColorMap[item.status]}>{item.status}</Tag>
              </p>
              {item.note && <p>Ghi chú: {item.note}</p>}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      <Card>
        <div className="flex gap-2">
          <Button
            danger
            onClick={() => setIsCancelModalOpen(true)}
            disabled={[
              "Đã hủy",
              "Hoàn đơn",
              "Đang giao hàng",
              "Đã giao hàng",
              "Hoàn thành"
            ].includes(orderInfor?.status)}
          >
            Hủy đơn hàng
          </Button>
          <Button
            onClick={() => setIsReturnModalOpen(true)}
            disabled={
              !["Đã giao hàng", "Hoàn thành"].includes(orderInfor?.status) ||
              ["Đã hủy", "Hoàn đơn"].includes(orderInfor?.status)
            }
          >
            Hoàn đơn
          </Button>
        </div>
      </Card>

      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={isCancelModalOpen}
        onOk={handleCancelOrder}
        onCancel={() => setIsCancelModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
        <Input.TextArea
          placeholder="Nhập lý do hủy đơn hàng (không bắt buộc)"
          value={cancelNote}
          onChange={(e) => setCancelNote(e.target.value)}
        />
      </Modal>

      <Modal
        title="Xác nhận hoàn đơn"
        visible={isReturnModalOpen}
        onOk={handleReturnOrder}
        onCancel={() => setIsReturnModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hoàn đơn hàng này?</p>
        <Input.TextArea
          placeholder="Nhập lý do hoàn đơn hàng (không bắt buộc)"
          value={returnNote}
          onChange={(e) => setReturnNote(e.target.value)}
        />
      </Modal>

      <Card title="Thông tin đơn hàng">
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
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColorMap[orderInfor?.status]}>
              {orderInfor?.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Danh sách sản phẩm">
        <Table
          dataSource={orderItems}
          columns={[
            { title: "Tên sản phẩm", dataIndex: "name" },
            { title: "Số lượng", dataIndex: "quantity" },
            {
              title: "Đơn giá",
              dataIndex: "price",
              render: (price) => `${price.toLocaleString()} đ`
            },
            {
              title: "Tổng",
              dataIndex: "totalItemPrice",
              render: (price) => `${price.toLocaleString()} đ`
            }
          ]}
          pagination={false}
          bordered
        />
      </Card>

      <Card title="Thông tin thanh toán">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tổng tiền hàng">
            {`${totalPrice?.toLocaleString()} đ`}
          </Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">
            {`${shippingCost?.toLocaleString()} đ`}
          </Descriptions.Item>
          <Descriptions.Item label="Voucher giảm giá">
            {`${discountVoucher?.toLocaleString()} đ`}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng thanh toán">
            <strong>{`${totalCost?.toLocaleString()} đ`}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderDetail;
