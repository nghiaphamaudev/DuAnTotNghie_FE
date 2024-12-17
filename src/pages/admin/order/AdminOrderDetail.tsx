import {
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Spin,
  Table,
  Tag,
  Timeline
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import {
  getAllOrdersServiceForAdmin,
  getOrderDetailServiceForAdmin,
  updateOrderServiceForAdmin
} from "../../../services/orderService";
import { socket } from "../../../socket";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRemoveOpen, setIsModalRemoveOpen] = useState(false);
  const [isModalReturnOpen, setIsModalReturnOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [cancelOrReturnNote, setCancelOrReturnNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusShip, setStatusShip] = useState(false);
  const navigate = useNavigate();
  const statusOrder = [
    "Đã xác nhận",
    "Đóng gói chờ vận chuyển",
    "Đang giao hàng",
    "Đã giao hàng"
  ];

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

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);
  useEffect(() => {
    const handleOrderStatusUpdate = () => {
      fetchOrderDetail();
    };
    // Lắng nghe sự kiện "update order status" từ server
    socket.on("update status order", (id: any) => {
      console.log(id);
      if (id && id === orderId) handleOrderStatusUpdate();
    });

    socket.on("user update status order", (id: any) => {
      console.log(id);
      if (id && id === orderId) handleOrderStatusUpdate();
    });

    // Xóa sự kiện khi component bị hủy
    return () => {
      socket.off("update status order", handleOrderStatusUpdate());
    };
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true); // Bật trạng thái loading
    const response = await getAllOrdersServiceForAdmin();
    console.log("response", response);
    const order = response.data.find((order) => order._id === orderId);
    console.log("orderMatch", order);

    try {
      if (!orderId) {
        throw new Error("Không tìm thấy mã đơn hàng.");
      }

      const response = await getOrderDetailServiceForAdmin(orderId);

      if (!response || !response.data) {
        throw new Error("Không thể tải thông tin đơn hàng."); // Trường hợp dữ liệu trả về không hợp lệ
      }

      setOrderDetail(response.data); // Cập nhật dữ liệu vào state
    } catch (error) {
      console.error("fetchOrderDetail Error: ", error); // Log lỗi để debug
      message.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại."); // Hiển thị thông báo lỗi
      navigate("/admin/bill");
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  const handleStatusChange = async (status, note = "") => {
    setIsProcessing(true);
    try {
      if (["Đã hủy", "Hoàn đơn"].includes(status)) {
        if (
          [
            "Đóng gói chờ vận chuyển",
            "Đang giao hàng",
            "Đã nhận được hàng"
          ].includes(orderInfor?.status)
        ) {
          message.warning(
            "Trạng thái hiện tại không cho phép thực hiện hành động này."
          );
          return;
        }
        if (!note.trim()) {
          message.warning(
            "Vui lòng nhập lý do trước khi thực hiện hành động này."
          );
          return;
        }
      }
      const response = await updateOrderServiceForAdmin(orderId, status, note);

      console.log("RES:", response);

      if (response?.status) {
        message.success(`Đơn hàng đã chuyển sang trạng thái "${status}"`);
        socket.emit("update status order", orderId);
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
  const handleCancelOrder = async (note) => {
    setIsProcessing(true);
    try {
      if (!note.trim()) {
        message.warning("Vui lòng nhập lý do hủy đơn.");
        return;
      }

      const response = await updateOrderServiceForAdmin(
        orderId,
        "Đã hủy",
        note
      );
      if (response?.status) {
        message.success("Đơn hàng đã được hủy thành công.");
        socket.emit("update status order", orderId);
        await fetchOrderDetail();
      } else {
        message.error(response?.message || "Hủy đơn thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    } finally {
      setIsModalRemoveOpen(false);
      setCancelOrReturnNote("");
      setIsProcessing(false);
    }
  };

  const handleReturnOrder = async (note, statusShip) => {
    setIsProcessing(true);
    try {
      if (!note.trim()) {
        message.warning("Vui lòng nhập lý do hoàn đơn.");
        return;
      }

      const response = await updateOrderServiceForAdmin(
        orderId,
        "Hoàn đơn",
        note,
        statusShip
      );
      if (response?.status) {
        message.success("Đơn hàng đã được hoàn thành công.");
        await fetchOrderDetail();
      } else {
        message.error(response?.message || "Hoàn đơn thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hoàn đơn hàng.");
    } finally {
      setIsModalReturnOpen(false);
      setCancelOrReturnNote("");
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
    historyTransaction,
    totalPrice,
    shippingCost,
    discountVoucher,
    totalCost,
    createdAt
  } = orderDetail;
  console.log("orderDetail", orderDetail);

  const currentStatusIndex = statusOrder.findIndex(
    (status) => status === orderInfor?.status
  );
  console.log("currentStatusIndex", currentStatusIndex);

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
        <div className="flex flex-wrap gap-2">
          {statusOrder.map((status, index) => (
            <Button
              key={status}
              loading={isProcessing && newStatus === status}
              disabled={
                isProcessing ||
                index !== currentStatusIndex + 1 ||
                orderInfor?.status === "Đã nhận được hàng" ||
                orderInfor?.status === "Đã hủy" ||
                orderInfor?.status === "Hoàn đơn"
              }
              onClick={() => {
                setNewStatus(status);
                setIsModalOpen(true);
              }}
              className="mb-2"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Modal xác nhận */}
        <Modal
          title="Xác nhận cập nhật trạng thái"
          visible={isModalOpen}
          onOk={() => handleStatusChange(newStatus)}
          onCancel={() => setIsModalOpen(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={isProcessing}
        >
          <p>
            Bạn có chắc muốn chuyển trạng thái đơn hàng sang "{newStatus}"
            không?
          </p>
        </Modal>
      </Card>
      <Card>
        <div className="flex gap-2">
          <Button
            loading={isProcessing}
            disabled={
              isProcessing ||
              [
                "Đã hủy",
                "Hoàn đơn",
                "Đang giao hàng",
                "Đã giao hàng",
                "Đã nhận được hàng"
              ].includes(orderInfor?.status)
            }
            onClick={() => {
              setNewStatus("Đã hủy");
              setIsModalRemoveOpen(true);
            }}
          >
            Hủy đơn
          </Button>
          <Button
            loading={isProcessing}
            disabled={isProcessing || orderInfor?.status !== "Đang giao hàng"}
            onClick={() => {
              setNewStatus("Hoàn đơn");
              setIsModalReturnOpen(true);
            }}
          >
            Hoàn đơn
          </Button>
        </div>

        {/* Modal xác nhận */}
        <Modal
          title="Xác nhận hủy đơn"
          visible={isModalRemoveOpen}
          onOk={() => handleCancelOrder(cancelOrReturnNote)}
          onCancel={() => setIsModalRemoveOpen(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={isProcessing}
        >
          <p>Bạn có chắc muốn hủy đơn hàng không?</p>
          <textarea
            value={cancelOrReturnNote}
            onChange={(e) => setCancelOrReturnNote(e.target.value)}
            placeholder="Nhập lý do (bắt buộc)"
            style={{
              width: "100%",
              height: "80px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginTop: "10px"
            }}
          />
        </Modal>

        <Modal
          title="Xác nhận hoàn đơn"
          visible={isModalReturnOpen}
          onOk={() => handleReturnOrder(cancelOrReturnNote, statusShip)}
          onCancel={() => setIsModalReturnOpen(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={isProcessing}
        >
          <p>Bạn có chắc muốn hoàn đơn hàng không?</p>
          <textarea
            value={cancelOrReturnNote}
            onChange={(e) => setCancelOrReturnNote(e.target.value)}
            placeholder="Nhập lý do (bắt buộc)"
            style={{
              width: "100%",
              height: "80px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginTop: "10px"
            }}
          />

          <fieldset>
            <legend className="text-lg font-medium text-gray-900">
              Phí giao hàng khi hoàn hàng
            </legend>

            <p className="mt-1 text-pretty text-sm text-gray-700">
              Khách hàng đã trả phí giao hàng khi hoàn chưa?
            </p>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="Option2"
                className="flex cursor-pointer items-start gap-4"
              >
                <div className="flex items-center">
                  &#8203;
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300"
                    id="Option2"
                    checked={statusShip === true}
                    onChange={() => setStatusShip(true)}
                  />
                </div>

                <div>
                  <strong className="font-medium text-gray-900"> Đã trả</strong>
                </div>
              </label>

              <label
                htmlFor="Option3"
                className="flex cursor-pointer items-start gap-4"
              >
                <div className="flex items-center">
                  &#8203;
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300"
                    id="Option3"
                    checked={statusShip === false}
                    onChange={() => setStatusShip(false)}
                  />
                </div>

                <div>
                  <strong className="font-medium text-gray-900">
                    {" "}
                    Chưa trả
                  </strong>
                </div>
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Trạng thái hiện tại:{" "}
              <Tag color={statusShip ? "green" : "yellow"}>
                {statusShip ? "Đã trả" : "Chưa trả"}
              </Tag>
            </p>
          </fieldset>
        </Modal>
      </Card>
      {/* Thông tin đơn hàng */}
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

                  <div>
                    <strong className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white">
                      Giao dịch
                    </strong>

                    <h3 className="mt-4 text-lg font-medium sm:text-xl">
                      <span>Phương thức: {item.type}</span>
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      <strong>Mã giao dịch:</strong> {item.transactionVnPayId}{" "}
                      <br />
                      <strong>Số tiền:</strong>{" "}
                      {item.totalPrice.toLocaleString()} VNĐ <br />
                      <strong>Thời gian:</strong> {item.createdAt}
                    </p>

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

                    <div className="mt-4 sm:flex sm:items-center sm:gap-2">
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

export default AdminOrderDetail;
