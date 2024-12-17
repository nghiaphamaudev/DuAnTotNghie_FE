import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Spin,
  Table,
  Tag,
  Timeline
} from "antd";
import { MessageSquareMore } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetailService,
  updateOrderService
} from "../../../../services/orderService";
import FeedbackSection from "../Feedback";
import { socket } from "../../../../socket";

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

  useEffect(() => {
    const handleOrderStatusUpdate = () => {
      // Khi nhận được sự kiện cập nhật trạng thái, reload lại thông tin đơn hàng
      fetchOrderDetail(); // Gọi lại hàm lấy thông tin đơn hàng
    };
    // Lắng nghe sự kiện "update order status" từ server
    socket.on("update status order", (id: any) => {
      console.log(id);
      if (id && id === orderId) handleOrderStatusUpdate();
    });

    // Xóa sự kiện khi component bị hủy
    return () => {
      socket.off("update status order", handleOrderStatusUpdate());
    };
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      const response = await updateOrderService(orderId, "Đã hủy", cancelNote);
      if (response?.status) {
        message.success("Đơn hàng đã được hủy thành công.");
        socket.emit("user update status order", orderId);
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
        socket.emit("user update status order", orderId);
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
  console.log("historyTransaction", historyTransaction);

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
        loading={isProcessing}
      >
        <p className="my-2">Bạn có chắc chắn muốn hủy đơn hàng này?</p>
        <Input.TextArea
          style={{
            width: "100%",
            height: "80px",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginTop: "10px"
          }}
          placeholder="Nhập lý do hủy đơn hàng (không bắt buộc)"
          value={cancelNote}
          onChange={(e) => setCancelNote(e.target.value)}
        />
      </Modal>

      <Card title="Thông tin đơn hàng">
        <div className="flex justify-between items-center">
          <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm w-1/2">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Mã hóa đơn</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {orderInfor?.code}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Người nhận</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {" "}
                  {orderInfor?.receiver}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">SĐT người nhận</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {orderInfor?.phoneNumber}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Địa chỉ</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {orderInfor?.address}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Trạng thái</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  <Tag color={statusColorMap[orderInfor?.status]}>
                    {orderInfor?.status}
                  </Tag>
                </dd>
              </div>
            </dl>
          </div>
          <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm w-1/2">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900"></dt>
                <dd className="text-gray-700 sm:col-span-2"></dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Người tạo</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {orderInfor?.creator}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">SĐT người tạo</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {" "}
                  {orderInfor?.phoneNumberCreator}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">
                  Phương thức thanh toán
                </dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {" "}
                  <Tag
                    color={
                      orderInfor?.paymentMethod === "COD"
                        ? "#2db7f5"
                        : "#87d068"
                    }
                  >
                    {orderInfor?.paymentMethod}
                  </Tag>
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Ngày tạo</dt>
                <dd className="text-gray-700 sm:col-span-2">{createdAt}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div
          role="alert"
          className="rounded-xl border border-gray-100 bg-white p-4"
        >
          <div className="flex items-start gap-4">
            <span className="text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div className="flex-1">
              <strong className="block font-medium text-gray-900">
                {" "}
                Ghi chú cho đơn hàng
              </strong>

              <p className=" text-sm text-gray-500 italic">
                {orderInfor?.orderNote || "Không có ghi chú cho đơn hàng này."}
              </p>
            </div>
            <button className="text-gray-500 transition hover:text-gray-600">
              <span className="sr-only">Dismiss popup</span>
            </button>
          </div>
        </div>
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
        <div className="flex items-start gap-2">
          {historyTransaction && historyTransaction.length > 0 ? (
            historyTransaction.map((item, index) => (
              <article
                key={item.transactionVnPayId}
                className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8 w-full h-full"
              >
                <div className="flex items-start sm:gap-8">
                  <div
                    className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500"
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-1">
                      <span className="h-8 w-0.5 rounded-full bg-indigo-500"></span>
                      <span className="h-6 w-0.5 rounded-full bg-indigo-500"></span>
                      <span className="h-4 w-0.5 rounded-full bg-indigo-500"></span>
                      <span className="h-6 w-0.5 rounded-full bg-indigo-500"></span>
                      <span className="h-8 w-0.5 rounded-full bg-indigo-500"></span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-8 sm:mt-0">
                    <div className="mt-4 transition-info">
                      <h3 className=" text-lg font-medium sm:text-xl">
                        <span>Phương thức: {item.type}</span>
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        <strong>Mã giao dịch:</strong> {item.transactionVnPayId}{" "}
                        <br />
                        <strong>Số tiền:</strong>{" "}
                        {item.totalPrice.toLocaleString()} VNĐ <br />
                        <div className="mt-1 sm:flex sm:items-center sm:gap-2">
                          <div className="flex items-center gap-1 text-gray-500">
                            <svg
                              className="size-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>

                            <p className="text-xs font-medium">
                              Thời gian xử lý: {item.createdAt}
                            </p>
                          </div>
                        </div>
                      </p>
                    </div>

                    {Object.keys(item.refundDetails).length > 0 && (
                      <div className="mt-4 text-sm text-red-600">
                        <p>
                          <strong>Trạng thái hoàn tiền:</strong>{" "}
                          {item.refundDetails.transactionType}
                        </p>
                        <p>
                          <strong>Số tiền hoàn:</strong>{" "}
                          {item.refundDetails.refundAmount.toLocaleString()} VNĐ
                        </p>
                        <p>
                          <strong>Ngày hoàn:</strong>{" "}
                          {item.refundDetails.refundDate}
                        </p>
                        <p>
                          <strong>Ngân hàng:</strong>{" "}
                          {item.refundDetails.bankCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center text-gray-600 italic">
              Thông tin giao dịch không khả dụng
            </div>
          )}
        </div>
      </Card>
      <span className="flex items-center mt-10 mb-3">
        <span className="pr-6">Thông tin thanh toán</span>
        <span className="h-px flex-1 bg-black"></span>
      </span>
      <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm ">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Tổng tiền hàng</dt>
            <dd className="text-gray-700 sm:col-span-2 text-right">
              <strong>{`${(
                totalPrice +
                discountVoucher -
                shippingCost
              ).toLocaleString()} đ`}</strong>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Phí vận chuyển</dt>
            <dd className="text-gray-700 sm:col-span-2 text-right">
              + {`${shippingCost?.toLocaleString()} đ`}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Voucher giảm giá</dt>
            <dd className="text-gray-700 sm:col-span-2 text-right">
              - {`${discountVoucher?.toLocaleString()} đ`}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Tổng thanh toán</dt>
            <dd className="text-gray-700 sm:col-span-2 text-right">
              <strong>{`${totalPrice?.toLocaleString()} đ`}</strong>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default OrderDetail;
