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
  message,
  notification
} from "antd";
import axios from "axios";
import { TicketCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import codpay from "../../../assets/images/codpay.png";
import vnpay from "../../../assets/images/vnpay.png";
import checoutnotoken from "../../../assets/images/checkoutnotoken.jpg";
import { AddressRequest } from "../../../common/types/Address";
import { CartItem } from "../../../interface/Cart";
import { Coupon } from "../../../interface/Voucher";
import { getProfile } from "../../../services/authServices";
import {
  createOrderService,
  initiateVNPayPayment
} from "../../../services/orderService";
import { getVouchers } from "../../../services/vorcherServices";
import { useProduct } from "../../../contexts/ProductContext";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";
const { Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { token } = useAuth();
  const { cartData, setCountItemCart } = useCart();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [cart, setCart] = useState<{
    items: CartItem[];
    totalCartPrice: number;
  } | null>(null);
  const { allProduct } = useProduct();
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
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, []);
  const calculateTotalPrice = (selectedProducts: any[]) => {
    return selectedProducts.reduce(
      (total, item) => total + item.totalItemPrice,
      0
    );
  };
  const validateCartItems = async () => {
    // await queryClient.invalidateQueries({ queryKey: ["products"] });

    if (!cart?.items) return false;

    let isValid = true;
    const updatedCartItems = []; // Danh sách sản phẩm hợp lệ

    for (const item of cart.items) {
      const product = allProduct.find((p) => p.id === item.productId);
      console.log("PRODUCT: ", product);

      if (!product) {
        notification.error({
          message: "Sản phẩm không tồn tại!",
          duration: 4
        });
        return false;
      }
      if (!product?.isActive) {
        notification.warning({
          message: `Sản phẩm ${product?.name} đã ngừng kinh doanh!`,
          duration: 4
        });
        isValid = false;
        return false;
      }
      const variant = product?.variants.find((v) => v.id === item.variantId);
      console.log("VARIANT: ", variant);

      if (!variant?.status) {
        notification.error({
          message: `Phiên bản sản phẩm màu ${item.color} không tồn tại!`,
          duration: 4
        });
        return false;
      }
      const size = variant?.sizes.find((s) => s.id === item.sizeId);
      if (!size?.status) {
        notification.error({
          message: `Kích thước sản phẩm ${product.name} với màu ${variant.color} không tồn tại!`,
          duration: 4
        });
        isValid = false;
      }

      if (size?.inventory < item.quantity) {
        notification.error({
          message: `Sản phẩm ${product.name} với kích thước ${size.name} không đủ tồn kho!`,
          duration: 4
        });
        isValid = false;
      }

      if (size?.inventory === 0) {
        notification.error({
          message: `Sản phẩm ${product.name} với kích thước ${size.name} đã hết hàng!`,
          duration: 4
        });
        isValid = false;
      }

      updatedCartItems.push(item);
    }

    if (updatedCartItems.length !== cart.items.length) {
      setCart((prevCart) => ({
        ...prevCart,
        items: updatedCartItems,
        totalCartPrice: calculateTotalPrice(updatedCartItems)
      }));
      notification.error({
        message: `Một số sản phẩm không hợp lệ đã bị loại bỏ khỏi giỏ hàng!`,
        duration: 4
      });
    }

    return isValid && updatedCartItems.length > 0;
  };

  useEffect(() => {
    const selectedProducts = localStorage.getItem("selectedProducts");
    console.log("selectedProductsDATA: ", selectedProducts);
    console.log("allProductDATA: ", allProduct.splice(0, 2));

    if (selectedProducts) {
      const parsedProducts = JSON.parse(selectedProducts);
      const validCart = {
        items: parsedProducts,
        totalCartPrice: calculateTotalPrice(parsedProducts)
      };

      setCart(validCart);
      setTotalPrice(calculateTotalPrice(parsedProducts));
      validateCartItems();
    }
    console.log("CART", cart);
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

    fetchAddresses();
    fetchCoupons();
  }, []);

  const handleFinish = async (values: Record<string, any>) => {
    const isValid = await validateCartItems();
    if (!isValid) {
      // navigate("/home");
      return;
    }

    try {
      const discountVoucher =
        isCouponApplied && cart?.totalCartPrice
          ? cart.totalCartPrice - totalPrice
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
          notification.warning({
            message:
              `${response?.message}` || "Không thể khởi tạo thanh toán VNPay!",
            duration: 4
          });
        }
      } else {
        try {
          const res = await createOrderService(orderData);
          if (res.status) {
            queryClient.invalidateQueries({ queryKey: ["carts"] });
            setCountItemCart(cartData?.items?.length || 0);
            notification.success({
              message: "Đặt hàng thành công! Cảm ơn bạn đã tin tưởng!!.",
              duration: 4
            });

            localStorage.removeItem("selectedProducts");
            form.resetFields();
            navigate("/home");
          } else {
            notification.error({
              message: `${res?.message}` || "Something went wrong!",
              duration: 4
            });
          }
        } catch (error) {
          console.log("ERROR: ", error);
        }
      }
    } catch (error) {
      console.log("ERROR: ", error);

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
        notification.success({
          message: "Mã giảm giá đã được áp dụng! Cảm ơn bạn đã tin tưởng!!.",
          duration: 4
        });
      } else {
        notification.warning({
          message: "Giỏ hàng không đủ yêu cầu để sử dụng mã giảm giá!",
          duration: 4
        });
      }
    } else {
      notification.warning({
        message: "Mã giảm giá đã hết hạn hoặc chưa bắt đầu!",
        duration: 4
      });
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
      notification.warning({
        message: "Chỉ được áp dụng một mã giảm giá!",
        duration: 4
      });

      return;
    }

    // Kiểm tra nếu mã rỗng
    if (!couponCode.trim()) {
      notification.warning({
        message: "Vui lòng nhập mã giảm giá!",
        duration: 4
      });
      return;
    }

    // Tìm mã trong danh sách
    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      notification.warning({
        message: "Mã giảm giá không hợp lệ!",
        duration: 4
      });
      return;
    }

    // Kiểm tra ngày hiệu lực của mã
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const expirationDate = new Date(coupon.expirationDate);

    if (currentDate < startDate || currentDate > expirationDate) {
      notification.warning({
        message: "Mã giảm giá đã hết hạn hoặc chưa bắt đầu!",
        duration: 4
      });
      return;
    }

    // Kiểm tra tổng tiền đủ điều kiện áp dụng mã
    if (totalPrice < coupon.minPurchaseAmount) {
      notification.warning({
        message: "Giỏ hàng không đủ yêu cầu để sử dụng mã giảm giá!",
        duration: 4
      });
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
      notification.success({
        message: `Mã giảm giá đã được áp dụng! Bạn được giảm ${discountAmount.toLocaleString()}₫`,
        duration: 4
      });
    } catch (error) {
      notification.error({
        message: "Đã xảy ra lỗi khi áp dụng mã giảm giá!",
        duration: 4
      });
    }
  };

  return (
    <>
      {token ? (
        <div className="min-h-screen p-4 bg-gray-100 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl bg-white p-6 shadow-lg">
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Thông tin giao hàng
              </h2>
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
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" }
                  ]}
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
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ!" }
                  ]}
                >
                  <Input className="rounded-none" />
                </Form.Item>
                <Form.Item label="Ghi chú đơn hàng" name="orderNote">
                  <Input
                    className="rounded-none"
                    placeholder="Nhập ghi chú cho đơn hàng của bạn"
                  />
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
                        </Row>
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={6}>
                          <Image
                            src={item.images}
                            alt={item.name}
                            width={100}
                          />
                        </Col>
                        <Col xs={24} sm={18}>
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
                          -{(cart.totalCartPrice - totalPrice).toLocaleString()}
                          ₫
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
                        <span className="ml-2 text-sm">
                          Sử dụng mã giảm giá
                        </span>
                      </Button>
                      <div className="flex flex-col md:flex-row justify-center items-center gap-1">
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
                          className="px-5 py-2 rounded-sm bg-black text-white text-sm w-full md:w-1/3 whitespace-nowrap border border-gray-300"
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
            bodyStyle={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {coupons
                .slice()
                .reverse()
                .slice(0, 5)
                .map((coupon) => (
                  <Card
                    key={coupon.code}
                    style={{
                      border: isCouponDisabled(coupon)
                        ? "1px solid #d9d9d9"
                        : "1px solid #1890ff",
                      backgroundColor: isCouponDisabled(coupon)
                        ? "#f5f5f5"
                        : "#ffffff",
                      cursor: isCouponDisabled(coupon)
                        ? "not-allowed"
                        : "pointer"
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
                          color: isCouponDisabled(coupon)
                            ? "#bfbfbf"
                            : "#52c41a"
                        }}
                      >
                        Giảm giá:{" "}
                        {coupon.discountType === "percentage"
                          ? `${coupon?.discountPercentage}%`
                          : `${coupon?.discountAmount?.toLocaleString()}₫`}
                      </Text>

                      {/* Yêu cầu tối thiểu */}
                      {coupon.minPurchaseAmount && (
                        <Text
                          style={{
                            color: isCouponDisabled(coupon)
                              ? "#bfbfbf"
                              : "#595959"
                          }}
                        >
                          Áp dụng cho đơn hàng tối thiểu:{" "}
                          {coupon?.minPurchaseAmount.toLocaleString()}₫
                        </Text>
                      )}

                      {/* Hạn sử dụng */}
                      <Text
                        style={{
                          color: isCouponDisabled(coupon)
                            ? "#bfbfbf"
                            : "#595959"
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
      ) : (
        <div className="text-center w-full p-10">
          <img
            className=" w-[400px] h-[250px] mx-auto"
            src={checoutnotoken}
            alt="cart_empty"
          />
          <h2 className="text-large font-semibold"> Bạn chưa đăng nhập</h2>
          <div className="mx-auto text-medium">
            Vui lòng ấn{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500"
            >
              đăng nhập
            </button>
            {" hoặc "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500"
            >
              đăng ký
            </button>{" "}
            để tiếp tục
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
