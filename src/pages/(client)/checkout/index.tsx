import { Form, Input, Radio, Select, message } from "antd";
import { RadioChangeEvent } from "antd/es/radio";
import React, { useState } from "react";
import codpay from "../../../assets/images/codpay.png";
import vnpay from "../../../assets/images/vnpay.png";
import zalopay from "../../../assets/images/zalopay.png";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  paymentMethod: string;
  couponCode?: string;
}

const { Option } = Select;

const CheckoutPage: React.FC = () => {
  const [form] = Form.useForm<CheckoutFormData>();

  // State to track the selected payment and shipping methods
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [shippingMethod, setShippingMethod] = useState<string>("standard");

  // State to track the coupon code
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);

  // State to track the total price and shipping fee
  const [totalPrice, setTotalPrice] = useState<number>(299000);

  const calculateShippingFee = () => {
    return totalPrice >= 500000 ? 0 : 30000;
  };
  const shippingFee = calculateShippingFee(); // Calculate the shipping fee based on total price

  // List of valid coupons
  const validCoupons = [
    "GIAM30K1A2",
    "GIAM30K3B4",
    "GIAM30K5C6",
    "GIAM30K7D8",
    "GIAM30K9E0"
  ];

  const discountAmount = 30000; // Example discount (30K for valid coupons)

  // State to track if a coupon has been applied
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);

  // Function to handle form submission
  const handleFinish = (values: CheckoutFormData) => {
    console.log("Form values:", values);
  };

  // Function to handle changes in the payment method
  const handlePaymentChange = (e: RadioChangeEvent) => {
    setPaymentMethod(e.target.value);
  };

  // Function to handle changes in the shipping method
  const handleShippingChange = (e: RadioChangeEvent) => {
    setShippingMethod(e.target.value);
  };

  // Function to apply the coupon code
  const handleApplyCoupon = () => {
    if (isCouponApplied) {
      message.error("Chỉ được áp dụng một mã giảm giá.");
      return;
    }

    if (validCoupons.includes(couponCode || "")) {
      message.success("Mã giảm giá hợp lệ! Bạn được giảm 30.000₫");
      setTotalPrice(totalPrice - discountAmount); // Apply the discount
      setIsCouponApplied(true); // Mark coupon as applied
    } else {
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl bg-white p-6 shadow-lg">
        {/* Shipping Information Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Thông tin giao hàng</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ paymentMethod: "cod" }}
          >
            {/* Name Input */}
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input className="rounded-none" />
            </Form.Item>

            {/* Email Input */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" }
              ]}
            >
              <Input className="rounded-none" />
            </Form.Item>

            {/* Phone Input */}
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" }
              ]}
            >
              <Input className="rounded-none" />
            </Form.Item>

            {/* Address Input */}
            <Form.Item label="Địa chỉ" name="address">
              <Input className="rounded-none" />
            </Form.Item>
            {/* Province, District, and Ward Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item label="Tỉnh/Thành" name="province">
                <Select placeholder="Chọn tỉnh / thành">
                  <Option value="hanoi">Hà Nội</Option>
                  <Option value="hcm">Hồ Chí Minh</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Quận/Huyện" name="district">
                <Select placeholder="Chọn quận / huyện">
                  <Option value="ba-dinh">Ba Đình</Option>
                  <Option value="tan-binh">Tân Bình</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Phường/Xã" name="ward">
                <Select placeholder="Chọn phường / xã">
                  <Option value="phuong-1">Phường 1</Option>
                  <Option value="phuong-2">Phường 2</Option>
                </Select>
              </Form.Item>
            </div>

            <h3 className="text-xl font-semibold mt-6">
              Phương thức vận chuyển
            </h3>
            <Radio.Group onChange={handleShippingChange} value={shippingMethod}>
              <Radio value="standard">
                <div className="flex items-center space-x-2">
                  <span>Tiêu chuẩn: 30.000₫</span>
                </div>
              </Radio>
              <Radio
                value="free"
                disabled={totalPrice < 500000} // Disable if total price is less than 500K
              >
                <div className="flex items-center space-x-2">
                  <span>
                    Miễn phí vận chuyển với đơn hàng trên 500.000₫
                    {totalPrice < 500000 && (
                      <span className="text-red-500 ml-2">
                        (Chỉ áp dụng với đơn hàng từ 500.000₫)
                      </span>
                    )}
                  </span>
                </div>
              </Radio>
            </Radio.Group>

            {/* Payment Method Radio Group */}
            <h3 className="text-xl font-semibold mt-6">
              Phương thức thanh toán
            </h3>
            <Form.Item
              name="paymentMethod"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương thức thanh toán!"
                }
              ]}
            >
              <Radio.Group onChange={handlePaymentChange}>
                <Radio value="cod">
                  <div className="flex items-center space-x-2">
                    <img
                      src={codpay}
                      alt="COD"
                      className="w-6 h-6 object-contain"
                    />{" "}
                    {/* Adjust image size */}
                    <span>Thanh toán khi giao hàng (COD)</span>
                  </div>
                </Radio>
                <Radio value="zalopay">
                  <div className="flex items-center space-x-2">
                    <img
                      src={zalopay}
                      alt="ZaloPay"
                      className="w-6 h-6 object-contain"
                    />{" "}
                    {/* Adjust image size */}
                    <span>Ví điện tử ZaloPay</span>
                  </div>
                </Radio>
                <Radio value="vnpay">
                  <div className="flex items-center space-x-2">
                    <img
                      src={vnpay}
                      alt="VNPay"
                      className="w-6 h-6 object-contain"
                    />{" "}
                    {/* Adjust image size */}
                    <span>Ví điện tử VNPay</span>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>

            {/* Submit Button with Dynamic Text */}
            <button
              type="submit"
              className="w-full bg-black text-white border-none px-5 py-2"
            >
              {paymentMethod === "vnpay"
                ? "Thanh toán bằng VNPay"
                : "Hoàn tất đơn hàng"}
            </button>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-xl font-semibold">Tóm tắt đơn hàng</h4>

          {/* Product name and price */}
          <div className="flex justify-between mt-4 text-sm">
            {" "}
            {/* Adjusted font size */}
            <span>Áo Hoodie Phong Cách x 1</span>
            <span>{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            {" "}
            {/* Adjusted font size */}
            <span>Áo Hoodie Phong Cách x 1</span>
            <span>{totalPrice.toLocaleString()}</span>
          </div>

          {/* Shipping fee display */}
          <div className="flex justify-between mt-2 text-sm">
            <span>Phí vận chuyển</span>
            <span>
              {shippingFee === 0
                ? "Miễn phí"
                : `${shippingFee.toLocaleString()}₫`}
            </span>
          </div>

          {/* Total price */}
          <div className="flex justify-between mt-2 text-sm">
            <span>Tổng tiền</span>
            <span className="text-lg font-semibold">
              {(totalPrice + shippingFee).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND"
              })}
            </span>
          </div>

          {/* Coupon code input */}
          <div className="mt-4 flex flex-col md:flex-row items-center gap-2">
            <Input
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-5 py-2 border border-gray-300 rounded-none"
            />
            <button
              className="bg-black text-white px-4 py-2 w-full md:w-auto"
              onClick={handleApplyCoupon}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
