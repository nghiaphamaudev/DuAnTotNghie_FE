import {
  Button,
  Col,
  Divider,
  Input,
  notification,
  Popconfirm,
  Row,
  Checkbox
} from "antd";
import { Minus, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { useCart } from "../../../contexts/CartContext";

const ShoppingCart: React.FC = () => {
  // context
  const { cartData, deleteItemCart, updateQuantityItem } = useCart();
  const cartItems = cartData?.items;
  const totalAmount = cartData?.totalCartPrice;

  // state để lưu danh sách sản phẩm đã chọn
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]); // Thêm ID vào danh sách đã chọn
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id)); // Xóa ID khỏi danh sách đã chọn
    }
  };

  const handleDeleteItemCart = async (id: string) => {
    try {
      await deleteItemCart(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = async (
    id: string,
    value: number,
    option: string
  ) => {
    const payload = {
      cartItemId: id,
      option: option
    };
    const res = await updateQuantityItem(payload);
    if (!res.status) {
      notification.error({
        message: res.message,
        placement: "topRight",
        duration: 2
      });
    }
  };

  return (
    <div className="mx-auto px-5 py-8">
      <Row gutter={[16, 16]} className="shopping-cart">
        <Col xs={24} lg={16}>
          <h2 className="text-xl font-bold mb-5">Giỏ hàng của bạn</h2>
          {cartItems?.map((item) => (
            <div key={item.id} className="p-4 border mb-4">
              <Row gutter={[16, 16]} align="top">
                <Col xs={6} md={4}>
                  <img
                    className="w-full h-[150px] max-h-fit object-cover rounded-md" // Làm ảnh nhỏ lại
                    src={item?.images}
                    alt={item?.name}
                  />
                </Col>
                <Col xs={12} md={14} className="mt-3">
                  <h3 className="font-semibold text-lg">{item?.name}</h3>
                  <p>
                    Màu: {item.color} / Kích thước: {item?.size}
                  </p>
                </Col>
                <Col xs={6} md={6} className="text-right">
                  <p className="text-red-500 font-bold">
                    {item.price.toLocaleString()}₫
                  </p>
                  <div className="flex  items-start justify-end mt-2 ">
                    <Button
                      icon={<Minus size={16} />}
                      onClick={() =>
                        handleQuantityChange(item?.id, -1, "increase")
                      }
                      disabled={item.quantity <= 1}
                    />
                    <Input
                      value={item.quantity}
                      type="number"
                      min={1}
                      className="w-16 mx-2 text-center"
                    />
                    <Button
                      icon={<Plus size={16} />}
                      onClick={() =>
                        handleQuantityChange(item?.id, 1, "decrease")
                      }
                    />
                  </div>
                  <div className="flex justify-end items-center mt-5">
                    {/* Checkbox cho việc chọn sản phẩm */}
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) =>
                        handleCheckboxChange(item.id, e.target.checked)
                      }
                    >
                      Chọn sản phẩm
                    </Checkbox>
                    <Popconfirm
                      title="Bạn sẽ xóa sản phẩm ra khỏi giỏ hàng chứ?"
                      onConfirm={() => handleDeleteItemCart(item.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button
                        type="text"
                        icon={<Trash size={20} />}
                        className="text-red-500 hover:bg-red-100"
                      />
                    </Popconfirm>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
          <Divider />
        </Col>

        <Col xs={24} lg={8}>
          <div className="lg:sticky lg:top-44 lg:w-full">
            <div className="bg-white-100 border-[0.8px] border-gray-200 shadow-md p-4 rounded-sm">
              <h3 className="text-lg font-bold">Thông tin đơn hàng</h3>
              <p className="text-gray-700 flex justify-between items-center">
                <span>Tổng tiền:</span>{" "}
                <span className="text-lg font-semibold text-red-500">
                  {totalAmount?.toLocaleString()}₫
                </span>
              </p>
              <Button
                type="primary"
                danger
                className="w-full mt-4 py-5 rounded-none text-[16px] font-bold"
                disabled={selectedItems.length === 0} // Disable nếu không có sản phẩm được chọn
              >
                <Link to="/checkout"> Thanh Toán</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Phí vận chuyển sẽ được tính ở trang thanh toán.
              </p>
            </div>
            <div className="policy w-full mt-3 mx-auto py-5 px-3 bg-blue-50">
              <h3 className="text-medium font-bold"> Chính sách mua hàng:</h3>
              <p>
                Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị từ
                <span className="font-bold"> 0₫</span> trở lên!
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShoppingCart;
