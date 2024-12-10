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
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { debounce } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import CartEmptyImage from "../../../assets/images/empty_cart_retina.png";
import { useAuth } from "../../../contexts/AuthContext";
import CartNotToken from "../../../assets/images/cart_not_token.jpg";



const ShoppingCart: React.FC = () => {
  const { cartData, deleteItemCart, updateQuantityItem } = useCart();
  const { token } = useAuth();
  const cartItems = cartData?.items;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false); // Quản lý "Chọn tất cả"
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
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

  const handleNavigateCheckout = () => {
    queryClient.invalidateQueries({ queryKey: ["carts"] });
    const outOfStockItems = cartItems?.filter((item) => item?.inventory === 0);
    const changedItems = cartItems?.filter((item) => item.quantity > item.inventory);
    if (outOfStockItems && outOfStockItems?.length > 0) {
      outOfStockItems?.forEach((item) => {
        deleteItemCart(item.id);
      });
      notification.error({
        message: "Giỏ hàng đã có sự thay đổi. Xin vui lòng kiểm tra lại",
        duration: 4,
      });
      return
    } if (changedItems && changedItems?.length > 0) {
      notification.error({
        message: "Số lượng sản phẩm yêu cầu đã vượt quá số lượng tồn kho!",
        duration: 4,
      });
      return
    } else {
      navigate("/checkout");
    }

  }

  return (
    <>
      {
        cartItems && cartItems?.length > 0 && (
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
                            onClick={() => handleQuantityChange(item?.id, "decrease")}
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
                            onClick={() => handleQuantityChange(item?.id, "increase")}
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
                      onClick={() => handleNavigateCheckout()}
                      type="primary"
                      danger
                      className="w-full mt-4 py-5 rounded-none text-[16px] font-bold"
                      disabled={selectedItems.length === 0}
                    >
                      Thanh Toán
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
        )
      }

      {
        !token && (
          <div className="text-center w-full p-10">
            <img className=" w-[400px] h-[250px] mx-auto" src={CartNotToken} alt="cart_empty" />
            <h2 className="text-large font-semibold"> Bạn chưa đăng nhập</h2>
            <div className="mx-auto text-medium">
              Vui lòng ấn
              {' '}
              <button onClick={() => navigate("/login")} className="text-blue-500">đăng nhập</button>
              {' hoặc '}
              <button onClick={() => navigate("/register")} className="text-blue-500">đăng ký</button>
              {' '}
              để tiếp tục
            </div>
          </div>
        )
      }



      {
        cartItems && cartItems?.length === 0 && (
          <div className="text-center w-full p-10">
            <img className=" w-[400px] h-[250px] mx-auto" src={CartEmptyImage} alt="cart_empty" />
            <div className="mx-auto text-medium mt-10">Chưa có sản phẩm trong giỏ hàng</div>
            <button onClick={() => navigate("/product")} className="mt-10 bg-black text-white px-4 py-2 rounded-md">Mua sắm ngay</button>
          </div>
        )
      }


    </>
  );
};

export default ShoppingCart;
