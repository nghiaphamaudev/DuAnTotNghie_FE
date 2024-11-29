import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { debounce } from "lodash";
import { useQueryClient } from "@tanstack/react-query";

const ShoppingCart: React.FC = () => {
  const { cartData, deleteItemCart, updateQuantityItem } = useCart();
  const cartItems = cartData?.items;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false); // Quản lý "Chọn tất cả"
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, []);

  // Update the localStorage every time the selection changes
  useEffect(() => {
    setSelectAll(selectedItems.length === cartItems?.length);
    // Get selected items from the cart based on selected item IDs
    const selectedProducts =
      cartItems?.filter((item) => selectedItems.includes(item.id)) || [];
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts)); // Store selected products to localStorage
  }, [selectedItems, cartItems]);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = cartItems?.map((item) => item.id) || [];
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      ?.filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleDeleteItemCart = async (id: string) => {
    try {
      await deleteItemCart(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = debounce(async (id: string, option: string) => {
    const payload = { cartItemId: id, option };
    const res = await updateQuantityItem(payload);
    if (!res.status) {
      notification.error({
        message: res.message,
        placement: "topRight",
        duration: 2
      });
    }
  }, 400);

  return (
    <div className="mx-auto px-5 py-8">
      <Row gutter={[16, 16]} className="shopping-cart">
        <Col xs={24} lg={16}>
          <h2 className="text-xl font-bold mb-5">Giỏ hàng của bạn</h2>
          <div className="mb-3">
            <Checkbox
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              Chọn tất cả sản phẩm
            </Checkbox>
          </div>
          {cartItems?.map((item) => (
            <div key={item.id} className="p-4 border mb-4">
              <Row gutter={[16, 16]} align="top">
                <Col xs={6} md={4}>
                  <img
                    className="w-full h-[150px] max-h-fit object-cover rounded-md"
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
                  <div className="flex items-start justify-end mt-2">
                    <Button
                      icon={<Minus size={16} />}
                      onClick={() => handleQuantityChange(item?.id, "increase")}
                      disabled={item.quantity <= 1}
                    />
                    <Input
                      value={item.quantity}
                      type="number"
                      min={1}
                      className="w-16 mx-2 text-center"
                    />
                    <Button
                      disabled={item.quantity === item?.inventory}
                      icon={<Plus size={16} />}
                      onClick={() => handleQuantityChange(item?.id, "decrease")}
                    />
                  </div>
                  <div className="flex justify-end items-center mt-5">
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
                <span>Tổng tiền:</span>
                <span className="text-lg font-semibold text-red-500">
                  {calculateSelectedTotal()?.toLocaleString("vi-VN")}₫
                </span>
              </p>
              <Button
                type="primary"
                danger
                className="w-full mt-4 py-5 rounded-none text-[16px] font-bold"
                disabled={selectedItems.length === 0}
              >
                <Link to="/checkout">Thanh Toán</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Phí vận chuyển sẽ được tính ở trang thanh toán.
              </p>
            </div>
            <div className="policy w-full mt-3 mx-auto py-5 px-3 bg-blue-50">
              <h3 className="text-medium font-bold">Chính sách mua hàng:</h3>
              <p>
                Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị từ{" "}
                <span className="font-bold">0₫</span> trở lên!
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShoppingCart;
