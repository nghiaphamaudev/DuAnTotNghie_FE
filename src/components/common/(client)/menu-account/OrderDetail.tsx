import {
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Modal,
  Spin,
  Table,
  Tag,
  Timeline
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetailService,
  updateOrderService
} from "../../../../services/orderService";
import { MessageSquareMore } from "lucide-react";
import FeedbackSection from "../Feedback";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const statusColorMap = {
    "Chờ xác nhận": "blue",
    "Đã xác nhận": "green",
    "Đóng gói chờ vận chuyển": "orange",
    "Đang giao hàng": "purple",
    "Đã giao hàng": "cyan",
    "Đã nhận được hàng": "green",
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
      setIsProcessing(false);
    }
  };
  const handleComplete = async () => {
    try {
      const response = await updateOrderService(orderId, "Đã nhận được hàng");
      if (response?.status) {
        message.success("Bạn đã hoàn thành đơn hàng thành công.");
        await fetchOrderDetail();
      } else {
        message.error(response?.message || "Hoàn thành đơn hàng thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hoàn thành đơn hàng.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeedback = (record: any) => {
    setSelectedProductId(record.productId); // Lưu productId của sản phẩm được chọn
    setIsFeedbackModalOpen(true); // Mở modal đánh giá
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }
  console.log(orderDetail);
  const {
    orderInfor,
    orderItems,
    historyBill,
    historyTransaction,
    totalPrice,
    shippingCost,
    discountVoucher,
    totalCost,
    createdAt
  } = orderDetail;
  console.log("orderDetailCLI: ", orderDetail);

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
                width: "270px",
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
            loading={isProcessing}
            onClick={() => setIsCancelModalOpen(true)}
            disabled={[
              "Đã hủy",
              "Hoàn đơn",
              "Đang giao hàng",
              "Đã giao hàng",
              "Đã nhận được hàng"
            ].includes(orderInfor?.status)}
          >
            Hủy đơn hàng
          </Button>
          {orderInfor?.status === "Đã giao hàng" && (
            <Button
              style={{
                backgroundColor: "#219B9D",
                borderColor: "#219B9D",
                borderRadius: "none"
              }}
              type="primary"
              loading={isProcessing}
              onClick={() => handleComplete()}
            >
              Đã nhận được hàng
            </Button>
          )}
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
            },
            ...(orderInfor?.status === "Đã nhận được hàng"
              ? [
                  {
                    title: "Phản hồi",
                    dataIndex: "feedback",
                    render: (_, record) => (
                      <MessageSquareMore
                        style={{ cursor: "pointer" }}
                        onClick={() => handleFeedback(record)}
                      />
                    )
                  }
                ]
              : [])
          ]}
          pagination={false}
          bordered
        />
        <Modal
          title="Đánh giá sản phẩm"
          visible={isFeedbackModalOpen}
          onCancel={() => setIsFeedbackModalOpen(false)}
          footer={null}
        >
          {selectedProductId && (
            <FeedbackSection productId={selectedProductId} />
          )}
        </Modal>
      </Card>

      {/* Thông tin giao dịch */}
      <Card title="Thông tin giao dịch">
        {historyTransaction?.totalPrice !== undefined ? (
          <Descriptions bordered column={1}>
            {historyTransaction?.transactionVnPayId && (
              <Descriptions.Item label="Mã giao dịch">
                {historyTransaction.transactionVnPayId}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Hình thức thanh toán">
              {historyTransaction?.type}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền thanh toán">
              {`${historyTransaction?.totalPrice?.toLocaleString()} đ`}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày giao dịch">
              {historyTransaction?.createdAt}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p className="italic text-gray-500">
            Thông tin giao dịch không khả dụng.
          </p>
        )}
      </Card>

      <Card title="Thông tin thanh toán">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tổng tiền hàng">
            <strong>{`${(
              totalPrice +
              discountVoucher -
              shippingCost
            ).toLocaleString()} đ`}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">
            + {`${shippingCost?.toLocaleString()} đ`}
          </Descriptions.Item>
          <Descriptions.Item label="Voucher giảm giá">
            - {`${discountVoucher?.toLocaleString()} đ`}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng thanh toán">
            <strong> {`${totalPrice?.toLocaleString()} đ`}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderDetail;
