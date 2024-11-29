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
  message
} from "antd";
import {
  getOrderDetailService,
  updateOrderService
} from "../../../services/orderService";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [cancelOrReturnNote, setCancelOrReturnNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const statusOrder = [
    "Đã xác nhận",
    "Đóng gói chờ vận chuyển",
    "Đang giao hàng",
    "Đã giao hàng",
    "Hoàn thành",
    "Hoàn đơn",
    "Đã hủy"
  ];

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
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true); // Bật trạng thái loading

    try {
      if (!orderId) {
        throw new Error("Không tìm thấy mã đơn hàng."); // Trường hợp không có orderId
      }

      const response = await getOrderDetailService(orderId);

      if (!response || !response.data) {
        throw new Error("Không thể tải thông tin đơn hàng."); // Trường hợp dữ liệu trả về không hợp lệ
      }

      setOrderDetail(response.data); // Cập nhật dữ liệu vào state
    } catch (error) {
      console.error("fetchOrderDetail Error: ", error); // Log lỗi để debug
      message.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại."); // Hiển thị thông báo lỗi
      navigate("/admin/bill"); // Điều hướng về trang quản lý tài khoản
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  const handleStatusChange = async (status, note = "") => {
    setIsProcessing(true);
    try {
      if (["Đã hủy", "Hoàn đơn"].includes(status) && !note.trim()) {
        message.warning(
          "Vui lòng nhập lý do trước khi thực hiện hành động này."
        );
        return;
      }
      const response = await updateOrderService(orderId, status, note);
      if (response?.status) {
        message.success(`Đơn hàng đã chuyển sang trạng thái "${status}"`);
        await fetchOrderDetail();
      } else {
        message.error(response?.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    } finally {
      setIsModalOpen(false);
      setCancelOrReturnNote(""); // Reset ghi chú
      setIsProcessing(false);
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
  const currentStatusIndex = statusOrder.findIndex(
    (status) => status === orderInfor?.status
  );

  if (!orderDetail) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Không tìm thấy thông tin đơn hàng.</p>
        <Link to="/admin/bill">
          <Button>Quay về</Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "20px",
        fontFamily: "'Arial', sans-serif",
        fontSize: "14px"
      }}
    >
      <BreadcrumbsCustom nameHere={"Chi tiết đơn hàng"} listLink={[]} />
      <Link to={"/admin/bill"}>
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
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontStyle: "italic"
                  }}
                >
                  Ghi chú: {item.note}
                </p>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Các nút thay đổi trạng thái */}
      <Card>
        <div className="flex gap-2">
          {statusOrder.map((status, index) => (
            <Button
              key={status}
              variant="outlined"
              loading={isProcessing && newStatus === status}
              disabled={
                ["Đã hủy", "Hoàn đơn"].includes(orderInfor?.status) || // Không cho phép nếu đã hủy hoặc hoàn
                (index !== currentStatusIndex + 1 &&
                  !["Hoàn đơn", "Đã hủy"].includes(status))
              }
              onClick={() => {
                setNewStatus(status);
                setIsModalOpen(true);
              }}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Modal xác nhận */}
        <Modal
          title="Xác nhận cập nhật trạng thái"
          visible={isModalOpen}
          onOk={() => handleStatusChange(newStatus, cancelOrReturnNote)}
          onCancel={() => setIsModalOpen(false)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>
            Bạn có chắc muốn chuyển trạng thái đơn hàng sang "{newStatus}"
            không?
          </p>
          {["Đã hủy", "Hoàn đơn"].includes(newStatus) && (
            <textarea
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "10px"
              }}
              placeholder="Nhập lý do (bắt buộc)"
              value={cancelOrReturnNote}
              onChange={(e) => setCancelOrReturnNote(e.target.value)}
            />
          )}
        </Modal>
      </Card>

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
      <Card title="Thông tin thanh toán">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tổng tiền sản phẩm">
            {totalPrice?.toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">
            {shippingCost?.toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {discountVoucher ? `${discountVoucher.toLocaleString()} đ` : "0 đ"}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {totalCost?.toLocaleString()} đ
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default AdminOrderDetail;
