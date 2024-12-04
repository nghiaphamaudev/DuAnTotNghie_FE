import { Button, Divider, Drawer, notification, Progress } from "antd";
import { Trash, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import CartEmptyImage from "../../../assets/images/empty_cart_retina.png";
import CartNotToken from "../../../assets/images/cart_not_token.jpg";
import { CartItem } from "../../../interface/Cart";
import { useAuth } from "../../../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useProduct } from "../../../contexts/ProductContext";
import { Product } from "../../../interface/Order";



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
  cartItems,
  totalPrice,
  freeShippingThreshold
}) => {
  //context
  const { getDataProductById, allProduct } = useProduct();
  const { deleteItemCart } = useCart();
  const { token } = useAuth();

  //hooks
  const [isActiveProduct, setIsActiveProduct] = useState<boolean>(true);
  const [arrIdInvalid, setArrIdInvalid] = useState([])
  const [arrVariantInvalid, setArrVariantInvalid] = useState([])
  const [inventory, setinventory] = useState(cartItems[0]?.inventory)
  const nav = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["carts"] });
  }, [isCartDrawerOpen]);

  useEffect(() => {
    const result = validateProducts(cartItems, allProduct)
    const result2 = validateVariantStatus(cartItems, allProduct)
    setArrVariantInvalid(result2)
    if (result.isValid === false) {
      setIsActiveProduct(false)
      setArrIdInvalid(result.invalidIds)
    } else {
      setIsActiveProduct(true)
      setArrIdInvalid([])
    }
  }, [isCartDrawerOpen])
  console.log(cartItems);

  //functions
  const remainingAmountForFreeShipping = Math.max(
    freeShippingThreshold - totalPrice,
    0
  );

  const handleDeleteItemCart = async (id: string) => {
    try {
      await deleteItemCart(id);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = () => {
    nav('/login');
    closeCartDrawer();
  }

  const handleRegister = () => {
    nav('/register');
    closeCartDrawer();
  }
  const validateProducts = (array1: any, array2: any) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    const productStatusMap = new Map(
      array2.map((product) => [product.id, product.isActive])
    );

    // Kiểm tra từng sản phẩm trong array1
    const invalidProducts = array1
      .filter(item => !productStatusMap.get(item.productId)) // Lấy các sản phẩm isActive = false

    const errors = invalidProducts.map(
      item => `Product with ID ${item.productId} is inactive.`
    );

    const invalidIds = invalidProducts.map(item => item.id);

    if (errors.length > 0) {
      console.error(errors.join('\n'));
    }
    return {
      isValid: errors.length === 0,
      invalidIds,
      errors,
    };
  };

  const validateVariantStatus = (array1: any, array2: any) => {
    return array1
      .filter(item1 =>
        array2.some(item2 =>
          item2.variants.some(variant => variant.id === item1.variantId && variant.status === false)
        )
      )
      .map(item => item.variantId);
  };






  const handleClickToCart = async () => {
    const itemsWithZeroInventory = cartItems.filter(item => item.inventory === 0);

    if (!isActiveProduct) {
      notification.error({
        message: "Giỏ hàng đã có sự thay đổi. Xin vui lòng kiểm tra lại",
        duration: 4,
      });

      if (arrIdInvalid.length > 0) {
        for (const id of arrIdInvalid) {
          try {
            await deleteItemCart(id);
          } catch (error) {
            console.error(`Failed to delete product with ID: ${id}`, error);
          }
        }
        queryClient.invalidateQueries({ queryKey: ["carts"] });
      }
    } else if (itemsWithZeroInventory.length > 0) {
      // Thông báo cho người dùng về thay đổi trong giỏ hàng
      notification.warning({
        message: "Một số sản phẩm đã hết hàng và đã bị xóa khỏi giỏ hàng.",
        duration: 5,
      });

      // Xóa từng sản phẩm có inventory = 0
      for (const item of itemsWithZeroInventory) {
        try {
          await deleteItemCart(item.id);
        } catch (error) {
          console.error(`Failed to delete product with ID: ${item.id}`, error);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    } else {
      // Nếu tất cả sản phẩm hợp lệ
      nav('/cart');
      closeCartDrawer();
    }
  };


  return (
    <Drawer
      title="Giỏ hàng"
      placement="right"
      onClose={closeCartDrawer}
      open={isCartDrawerOpen}
      closeIcon={<X size={24} />}
      width={400}
    >
      {
        !token && (
          <div className="text-center">
            <img className="mt-16" src={CartNotToken} alt="cart_not_token" />
            <h2 className="text-large font-semibold"> Bạn chưa đăng nhập</h2>
            <div className="mx-auto text-medium">
              Vui lòng ấn
              {' '}
              <button onClick={() => { handleLogin() }} className="text-blue-500">đăng nhập</button>/
              <button onClick={() => { handleRegister() }} className="text-blue-500">đăng ký</button>
              {' '}
              để tiếp tục
            </div>
          </div>
        )
      }
      {
        token && cartItems && cartItems.length > 0 && (
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
        )
      }


      {/* Cart items and payment section */}
      <div className="flex flex-col h-full">
        {/* Cart items */}
        {
          token && cartItems && cartItems.length === 0 && (
            <>
              <img className="mt-16" src={CartEmptyImage} alt="cart_empty" />
              <div className="mx-auto text-medium mt-10">Chưa có sản phẩm trong giỏ hàng</div>
            </>
          )
        }
        {
          cartItems?.length > 0 && (
            <div className="flex-grow p-4 overflow-y-auto">
              {cartItems?.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center">
                    <img
                      src={item.images}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-500">
                        {item.color} / {item.size}
                      </p>
                      <div className="flex items-center">
                        <div className="flex space-x-2 items-center">
                          <div>
                            Số lượng:<strong className="ml-1">{item.quantity}</strong>
                          </div>
                          <Button
                            onClick={() => handleDeleteItemCart(item.id)}
                            type="text"
                            icon={<Trash size={16} />}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-bold text-red-500">
                        {item?.totalItemPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </p>
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
            </div>
          )
        }


        {/* Payment section */}
        {
          cartItems && cartItems.length > 0 && (
            <>
              <div className="p-4 border-t border-gray-200 mb-16">
                <div className="flex justify-between items-center mb-5">
                  <span className="font-semibold">TỔNG TIỀN:</span>
                  <span className="font-bold text-red-500 text-xl">
                    {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </span>
                </div>
                <button onClick={() => handleClickToCart()} className="bg-red-500 text-white font-semibold w-full px-5 py-2 rounded-none">
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
            </>
          )
        }
      </div>
    </Drawer>
  );
};

export default QuickCart;
