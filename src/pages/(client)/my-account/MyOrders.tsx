import React from "react";
import { Card, Button, Typography, Rate } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ao from "../../../assets/images/ao.png";

const { Title, Text } = Typography;

const MyOrders = () => {
  return (
    <>
      <div className="p-6">
        <Title level={3}>Đơn hàng đã mua</Title>
        <Card className="shadow-md rounded-lg mb-4">
          <div className="flex">
            <img
              src={ao} // Thay đổi đường dẫn tới ảnh sản phẩm
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <Title level={4} className="mb-2">
                ÁO T SHIRT TRƠN IN LOGO NGỰC FSTS001
              </Title>
              <Text className="text-gray-500">Phân loại hàng: Q8</Text>
              <div className="flex items-center mt-2">
                <Rate disabled defaultValue={4} />
                <Text className="ml-2 text-gray-500">(200 đánh giá)</Text>
              </div>
              <Text className="block mt-2 text-xl font-semibold">
                138.000đ{" "}
                <span className="line-through text-gray-500">198.000đ</span>
              </Text>
              <Text className="text-red-500 mt-2">
                7 ngày trả hàng miễn phí
              </Text>
              <div className="flex justify-between mt-4">
                <Button
                  type="primary"
                  style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
                  className="flex items-center"
                  icon={<CheckCircleOutlined />}
                >
                  Hoàn thành
                </Button>
                <Button
                  type="default"
                  className="border border-[#2AB573] text-[#2AB573] hover:text-white hover:bg-[#2AB573] hover:border-[#2AB573]"
                  style={{color:"#2AB573", borderColor: "#2AB573" }}
                >
                  Đánh giá
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default MyOrders;
