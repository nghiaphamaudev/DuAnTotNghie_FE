import { Drawer, Button, Divider, InputNumber, Progress } from "antd";
import { X, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { FC, useState, useEffect } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
};

interface QuickCartProps {
  isCartDrawerOpen: boolean;
  closeCartDrawer: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  freeShippingThreshold: number;
}

const QuickCart: FC<QuickCartProps> = ({
  isCartDrawerOpen,
  closeCartDrawer,
  cartItems: initialCartItems,
  totalPrice: initialTotalPrice,
  freeShippingThreshold
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);

  // Function to update the total price
  const calculateTotalPrice = (items: CartItem[]) => {
    const newTotalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  // Handle increment of item quantity
  const handleIncrement = (id: string) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  // Handle decrement of item quantity
  const handleDecrement = (id: string) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const remainingAmountForFreeShipping = Math.max(
    freeShippingThreshold - totalPrice,
    0
  );

  // Ensure total price is recalculated when initialCartItems changes
  useEffect(() => {
    setCartItems(initialCartItems);
    calculateTotalPrice(initialCartItems);
  }, [initialCartItems]);

  return (
    <Drawer
      title="Giỏ hàng"
      placement="right"
      onClose={closeCartDrawer}
      open={isCartDrawerOpen}
      closeIcon={<X size={24} />}
      width={400}
    >
      {/* Free shipping progress bar */}
      <div className="p-4">
        {totalPrice >= freeShippingThreshold ? (
          <p className="text-green-500">
            Bạn đã đủ điều kiện <strong>MIỄN PHÍ VẬN CHUYỂN</strong>!
          </p>
        ) : (
          <p>
            Bạn cần mua thêm{" "}
            <span className="text-red-500">
              {remainingAmountForFreeShipping.toLocaleString()}₫
            </span>{" "}
            để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>
          </p>
        )}
        <Progress
          className=""
          percent={(totalPrice / freeShippingThreshold) * 100}
          showInfo={false}
        />
      </div>

      {/* Cart items and payment section */}
      <div className="flex flex-col h-full">
        {/* Cart items */}
        <div className="flex-grow p-4 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id}>
              <div className="flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">
                    {item.color} / {item.size}
                  </p>
                  <div className="flex items-center">
                    <Button
                      icon={<Minus />}
                      size="small"
                      onClick={() => handleDecrement(item.id)}
                    />
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      className="mx-2"
                      readOnly
                    />
                    <Button
                      icon={<Plus />}
                      size="small"
                      onClick={() => handleIncrement(item.id)}
                    />
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold text-red-500">
                    {item.price.toLocaleString()}₫
                  </p>
                  {item.discountPrice && (
                    <p className="text-gray-500 line-through">
                      {item.discountPrice.toLocaleString()}₫
                    </p>
                  )}
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </div>

        {/* Payment section */}
        <div className="p-4 border-t border-gray-200 mb-16">
          <div className="flex justify-between items-center mb-5">
            <span className="font-semibold">TỔNG TIỀN:</span>
            <span className="font-bold text-red-500 text-xl">
              {totalPrice.toLocaleString()}₫
            </span>
          </div>
          <button className="bg-red-500 text-white font-semibold w-full px-5 py-2 rounded-none">
            THANH TOÁN
          </button>

          <div className="flex justify-between items-center mt-4">
            <Link to="/cart" className="text-blue-500 underline">
              Xem giỏ hàng
            </Link>
            <Link to="/promotions" className="text-blue-500 underline">
              Khuyến mãi dành cho bạn
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default QuickCart;
