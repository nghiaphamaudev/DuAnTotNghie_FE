import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
  message
} from "antd";
import axios from "axios";
import { TicketCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import codpay from "../../../assets/images/codpay.png";
import vnpay from "../../../assets/images/vnpay.png";
import { AddressRequest } from "../../../common/types/Address";
import { CartItem } from "../../../interface/Cart";
import { Coupon } from "../../../interface/Voucher";
import { getProfile } from "../../../services/authServices";
import {
  createOrderService,
  initiateVNPayPayment
} from "../../../services/orderService";
import { getVouchers } from "../../../services/vorcherServices";
const { Text } = Typography;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [cart, setCart] = useState<{
    items: CartItem[];
    totalCartPrice: number;
  } | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleVoucher, setModalVisibleVoucher] = useState(false);
  const [addresses, setAddresses] = useState<AddressRequest[] | undefined>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const shippingFee: number = totalPrice >= 500000 ? 0 : 30000;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null
  );
  const calculateTotalPrice = (selectedProducts: any[]) => {
    return selectedProducts.reduce(
      (total, item) => total + item.totalItemPrice,
      0
    );
  };
  useEffect(() => {
    // const fetchCart = async () => {
    //   try {
    //     const cartData = await getCartForUserServices();
    //     setCart(cartData.data);
    //     setTotalPrice(cartData.data.totalCartPrice);
    //   } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //       message.error(error.response?.data || "Lỗi khi lấy giỏ hàng!");
    //     }
    //   }
    // };

    const selectedProducts = localStorage.getItem("selectedProducts");
    if (selectedProducts) {
      const parsedProducts = JSON.parse(selectedProducts);
      setCart({
        items: parsedProducts,
        totalCartPrice: calculateTotalPrice(parsedProducts)
      });
      setTotalPrice(calculateTotalPrice(parsedProducts));
    }

    const fetchAddresses = async () => {
      try {
        const profile = await getProfile();
        setAddresses(profile.data.addresses);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Lỗi khi lấy địa chỉ!");
        }
      }
    };

    const fetchCoupons = async () => {
      try {
        const vorchers = await getVouchers();
        console.log("vorcher: ", vorchers);

        setCoupons(vorchers.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Lỗi khi lấy mã giảm giá!");
        }
      }
    };

    // fetchCart();
    fetchAddresses();
    fetchCoupons();
  }, []);

  const handleFinish = async (values: any) => {
    try {
      const discountVoucher = isCouponApplied
        ? cart?.totalCartPrice - totalPrice
        : 0;

      const orderData = {
        ...values,
        paymentMethod,
        orderItems: cart?.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: totalPrice + shippingFee,
        shippingCost: shippingFee,
        discountVoucher
      };

      if (paymentMethod === "VNPAY") {
        const response = await initiateVNPayPayment(orderData);
        if (response?.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          message.error("Không thể khởi tạo thanh toán VNPay!");
        }
      } else {
        await createOrderService(orderData);
        message.success("Đặt hàng thành công!");
        localStorage.removeItem("selectedProducts");
        form.resetFields();
        //
        window.location.href = "/home";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Đặt hàng thất bại!");
      }
    }
  };
  const handleBackToCart = () => {
    localStorage.removeItem("selectedProducts"); // Xóa sản phẩm khỏi localStorage khi quay lại giỏ hàng
  };
  const handleSelectAddress = (address: AddressRequest) => {
    form.setFieldsValue({
      receiver: address.nameReceiver,
      phoneNumber: address.phoneNumberReceiver,
      address: `${address.detailAddressReceiver}, ${address.addressReceiver.ward.name}, ${address.addressReceiver.district.name}, ${address.addressReceiver.province.name}`
    });
    setModalVisible(false);
  };

  const handleSelectCoupon = (coupon: Coupon) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const expirationDate = new Date(coupon.expirationDate);

    if (currentDate >= startDate && currentDate <= expirationDate) {
      if (totalPrice >= coupon.minPurchaseAmount) {
        let discountAmount = 0;

        if (
          coupon?.discountType === "percentage" &&
          coupon?.discountPercentage
        ) {
          discountAmount = (totalPrice * coupon?.discountPercentage) / 100;
        } else if (coupon?.discountType === "amount" && coupon.discountAmount) {
          discountAmount = coupon.discountAmount;
        }

        setTotalPrice((prev) => prev - discountAmount);
        setCouponCode(coupon.code);
        setIsCouponApplied(true);
        setModalVisibleVoucher(false);
        message.success("Mã giảm giá đã được áp dụng!");
      } else {
        message.error("Giỏ hàng không đủ yêu cầu để sử dụng mã giảm giá!");
      }
    } else {
      message.error("Mã giảm giá đã hết hạn hoặc chưa bắt đầu!");
    }
  };

  const isCouponDisabled = (coupon: Coupon) => {
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const expirationDate = new Date(coupon.expirationDate);

    return (
      currentDate < startDate ||
      currentDate > expirationDate ||
      totalPrice < coupon.minPurchaseAmount ||
      coupon?.quantity - coupon?.usedCount <= 0
    );
  };

  const handleApplyCoupon = async () => {
    // Kiểm tra nếu đã áp dụng mã
    if (isCouponApplied) {
      message.error("Chỉ được áp dụng một mã giảm giá.");
      return;
    }

    // Kiểm tra nếu mã rỗng
    if (!couponCode.trim()) {
      message.error("Vui lòng nhập mã giảm giá.");
      return;
    }

    // Tìm mã trong danh sách
    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      message.error("Mã giảm giá không hợp lệ!");
      return;
    }

    // Kiểm tra ngày hiệu lực của mã
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const expirationDate = new Date(coupon.expirationDate);

    if (currentDate < startDate || currentDate > expirationDate) {
      message.error("Mã giảm giá đã hết hạn hoặc chưa bắt đầu!");
      return;
    }

    // Kiểm tra tổng tiền đủ điều kiện áp dụng mã
    if (totalPrice < coupon.minPurchaseAmount) {
      message.error("Giỏ hàng không đủ yêu cầu để sử dụng mã giảm giá!");
      return;
    }

    try {
      // Tính toán giá trị giảm giá
      let discountAmount = 0;

      if (coupon.discountType === "percentage" && coupon.discountPercentage) {
        discountAmount = (totalPrice * coupon.discountPercentage) / 100;
      } else if (coupon.discountType === "amount" && coupon.discountAmount) {
        discountAmount = coupon.discountAmount;
      }

      // Giới hạn giá trị giảm giá không vượt quá tổng giá trị đơn hàng
      discountAmount = Math.min(discountAmount, totalPrice);

      // Cập nhật giá trị tổng tiền và trạng thái
      setTotalPrice((prev) => prev - discountAmount);
      setIsCouponApplied(true);
      setAppliedCouponCode(couponCode); // Lưu mã đã áp dụng
      message.success(
        `Mã giảm giá đã được áp dụng! Bạn được giảm ${discountAmount.toLocaleString()}₫`
      );
    } catch (error) {
      message.error("Đã xảy ra lỗi khi áp dụng mã giảm giá!");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl bg-white p-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Thông tin giao hàng</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ paymentMethod }}
          >
            <Button
              style={{ marginBottom: "10px" }}
              onClick={() => setModalVisible(true)}
            >
              Sử dụng địa chỉ có sẵn
            </Button>
            <Form.Item
              label="Họ và tên"
              name="receiver"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input className="rounded-none" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại phải gồm 10-11 chữ số!"
                }
              ]}
            >
              <Input className="rounded-none" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input className="rounded-none" />
            </Form.Item>
            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              rules={[
                { required: true, message: "Vui lòng chọn phương thức!" }
              ]}
            >
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                defaultValue="COD"
              >
                <Radio value="COD">
                  <img
                    src={codpay}
                    alt="COD"
                    className="w-6 h-6 object-contain"
                  />
                  Thanh toán khi giao hàng (COD)
                </Radio>
                <Radio value="VNPAY">
                  <img
                    src={vnpay}
                    alt="VNPay"
                    className="w-6 h-6 object-contain"
                  />
                  Ví điện tử VNPay
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <button
                type="submit"
                className="w-full bg-black text-white px-5 py-2"
              >
                {paymentMethod === "VNPAY"
                  ? "Thanh toán bằng VNPay"
                  : "Hoàn tất đơn hàng"}
              </button>
            </Form.Item>
          </Form>
          <Link
            style={{
              fontSize: "15px",
              textDecoration: "underline"
            }}
            to={"/cart"}
            onClick={handleBackToCart} // Xử lý khi quay lại giỏ hàng
          >
            Quay lại giỏ hàng
          </Link>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold">Tóm tắt đơn hàng</h4>
          {cart?.items && cart.items.length > 0 ? (
            <>
              {cart.items.map((item) => (
                <Card
                  key={item.id}
                  title={
                    <Row justify="space-between">
                      <Col>
                        <Space>
                          <Text strong>{item.name}</Text>
                        </Space>
                      </Col>
                      <Col>
                        <Text type="success">Còn hàng</Text>
                      </Col>
                    </Row>
                  }
                >
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <Image src={item.images} alt={item.name} width={100} />
                    </Col>
                    <Col span={18}>
                      <Space direction="vertical" size="small">
                        <Text>
                          Phân loại hàng: Màu {item.color}, Size {item.size}
                        </Text>
                        <Row justify="space-between">
                          <Text delete>{item.price.toLocaleString()}₫</Text>
                          <Text strong>
                            {item.totalItemPrice.toLocaleString()}₫
                          </Text>
                        </Row>
                        <Row justify="space-between">
                          <Text>Số lượng: x{item.quantity}</Text>
                          <Text strong>
                            Tổng: {item.totalItemPrice.toLocaleString()}₫
                          </Text>
                        </Row>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}

              <div className="mt-6 p-4 bg-white shadow">
                <Row justify="space-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>
                    {shippingFee === 0
                      ? "Miễn phí"
                      : `${shippingFee.toLocaleString()}₫`}
                  </Text>
                </Row>

                {isCouponApplied && (
                  <Row justify="space-between" style={{ color: "green" }}>
                    <Text>Giảm giá:</Text>
                    <Text>
                      -{(cart.totalCartPrice - totalPrice).toLocaleString()}₫
                    </Text>
                  </Row>
                )}

                <Row justify="space-between">
                  <Text>Thành tiền:</Text>
                  <Text strong>
                    {(totalPrice + shippingFee).toLocaleString()}₫
                  </Text>
                </Row>

                {/* Mã giảm giá */}
                <div className="flex flex-col mt-2 gap-1">
                  <Button onClick={() => setModalVisibleVoucher(true)}>
                    <TicketCheck />
                    <span className="ml-2 text-sm">Sử dụng mã giảm giá</span>
                  </Button>
                  <div className="flex justify-center items-center gap-1">
                    <input
                      type="text"
                      placeholder="Mã giảm giá"
                      className="px-5 py-2 rounded-sm w-full border border-gray-300"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isCouponApplied}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-5 py-2 rounded-sm bg-black text-white text-sm w-1/3 whitespace-nowrap border border-gray-300"
                    >
                      Áp dụng mã
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Text>Giỏ hàng rỗng</Text>
          )}
        </div>
      </div>
      <Modal
        title="Danh sách địa chỉ"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {addresses?.map((address) => (
          <Card
            key={address.id}
            onClick={() => handleSelectAddress(address)}
            hoverable
            className="mb-4"
          >
            <Space direction="vertical">
              <Text strong>{address.nameReceiver}</Text>
              <Text>{address.phoneNumberReceiver}</Text>
              <Text>
                {`${address.detailAddressReceiver}, ${address.addressReceiver.ward.name}, ${address.addressReceiver.district.name}, ${address.addressReceiver.province.name}`}
              </Text>
            </Space>
          </Card>
        ))}
      </Modal>
      <Modal
        title="Chọn mã giảm giá"
        visible={modalVisibleVoucher}
        onCancel={() => setModalVisibleVoucher(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {coupons.map((coupon) => (
            <Card
              key={coupon.code}
              style={{
                border: isCouponDisabled(coupon)
                  ? "1px solid #d9d9d9"
                  : "1px solid #1890ff",
                backgroundColor: isCouponDisabled(coupon)
                  ? "#f5f5f5"
                  : "#ffffff",
                cursor: isCouponDisabled(coupon) ? "not-allowed" : "pointer"
              }}
              onClick={() =>
                !isCouponDisabled(coupon) && handleSelectCoupon(coupon)
              }
              hoverable={!isCouponDisabled(coupon)}
            >
              <Space direction="vertical" size="small">
                {/* Mã giảm giá */}
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    color: isCouponDisabled(coupon) ? "#bfbfbf" : "#000"
                  }}
                >
                  Mã: {coupon.code}
                </Text>

                {/* Hiển thị giảm giá theo loại discountType */}
                <Text
                  style={{
                    color: isCouponDisabled(coupon) ? "#bfbfbf" : "#52c41a"
                  }}
                >
                  Giảm giá:{" "}
                  {coupon.discountType === "percentage"
                    ? `${coupon?.discountPercentage}%`
                    : `${coupon?.discountAmount?.toLocaleString()}₫`}
                </Text>

                {/* Yêu cầu tối thiểu */}
                {coupon.minPurchase && (
                  <Text
                    style={{
                      color: isCouponDisabled(coupon) ? "#bfbfbf" : "#595959"
                    }}
                  >
                    Áp dụng cho đơn hàng tối thiểu:{" "}
                    {coupon.minPurchase.toLocaleString()}₫
                  </Text>
                )}

                {/* Hạn sử dụng */}
                <Text
                  style={{
                    color: isCouponDisabled(coupon) ? "#bfbfbf" : "#595959"
                  }}
                >
                  Hạn sử dụng:{" "}
                  {new Date(coupon.expirationDate).toLocaleDateString()}
                </Text>
              </Space>
            </Card>
          ))}
        </Space>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
