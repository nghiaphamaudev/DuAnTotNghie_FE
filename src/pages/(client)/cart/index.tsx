import { Row, Col, Button, Input, Divider, message, Popconfirm } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "../../../components/common/(client)/ProductCard";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react"; // Import the delete icon

const ShoppingCart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Áo Polo dài tay basic FWTP065",
      price: 299000,
      image:
        "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__1__9074b85ed0384a0a9360158a2d908bbd_medium.png",
      color: "Xanh dương",
      size: "S",
      quantity: 1
    },
    {
      id: 2,
      name: "Áo Polo dài tay basic FWTP065",
      price: 299000,
      image:
        "https://product.hstatic.net/200000690725/product/avt_web_1150_x_1475_px__4173548a343d4291a95efb537d93de4c_master.png",
      color: "Nâu nhạt",
      size: "S",
      quantity: 1
    }
  ];

  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  // List of vouchers
  const vouchers = [
    "GIAM30K1A2",
    "GIAM30K3B4",
    "GIAM30K5C6",
    "GIAM30K7D8",
    "GIAM30K9E0"
  ];

  // Function to display vouchers when the button is clicked
  const handleVoucherClick = () => {
    const voucherMessage = `Các mã giảm giá hiện có: ${vouchers.join(", ")}`;
    message.success(voucherMessage, 5); // Show the message for 5 seconds
  };

  // Function to handle item deletion
  const handleDelete = (id: number) => {
    // Logic to delete the item from cart can go here
    message.success(`Đã xóa sản phẩm có ID: ${id}`);
  };

  return (
    <div className="mx-auto px-5 py-8">
      <Row gutter={[16, 16]} className="shopping-cart">
        {/* Cart Items Section */}
        <Col xs={24} lg={16}>
          <h2 className="text-xl font-bold mb-5">Giỏ hàng của bạn</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="p-4 border mb-4">
              <Row gutter={[16, 16]} align="top">
                <Col xs={6} md={4}>
                  <img
                    className="w-full h-auto max-h-fit object-cover rounded-md"
                    src={item.image}
                    alt={item.name}
                  />
                </Col>
                <Col xs={12} md={14} className="mt-3">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p>
                    Màu: {item.color} / Kích thước: {item.size}
                  </p>
                </Col>
                <Col xs={6} md={6} className="text-right">
                  <p className="text-red-500 font-bold">
                    {item.price.toLocaleString()}₫
                  </p>
                  <Input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className="w-16"
                  />
                  {/* Popconfirm for delete confirmation */}
                  <Popconfirm
                    title="Bạn sẽ xóa sản phẩm ra khỏi giỏ hàng chứ?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button
                      type="text"
                      icon={<Trash size={20} />}
                      className="text-red-500 hover:bg-red-100"
                    />
                  </Popconfirm>
                </Col>
              </Row>
            </div>
          ))}
          <Row className="mt-8">
            <Col>
              <h2 className="text-xl font-bold mb-5">
                Sản phẩm bạn có thể quan tâm
              </h2>
              <Swiper
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 }
                }}
                pagination={{ clickable: true }}
              >
                {[1, 2, 3, 4, 5, 6].map((product) => (
                  <SwiperSlide key={product}>
                    <ProductCard />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
          </Row>
          <Divider />
        </Col>

        {/* Summary Section */}
        <Col xs={24} lg={8}>
          <div className="lg:sticky lg:top-44 lg:w-full">
            <div className="bg-white-100 border-[0.8px] border-gray-200 shadow-md p-4 rounded-sm">
              <h3 className="text-lg font-bold">Thông tin đơn hàng</h3>
              <p className="text-gray-700 flex justify-between items-center">
                <span>Tổng tiền:</span>{" "}
                <span className="text-lg font-semibold text-red-500">
                  {totalAmount.toLocaleString()}₫
                </span>
              </p>
              <Button
                type="primary"
                danger
                className="w-full mt-4 py-5 rounded-none text-[16px] font-bold"
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
            <div className="vorcher w-full mt-3 mx-auto py-5 px-3 border-[1px]">
              <button
                className="text-medium font-bold"
                onClick={handleVoucherClick} // Handle voucher click
              >
                Nhấn để nhận vorcher giảm giá
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShoppingCart;
