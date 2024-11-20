import React, { useState } from "react";
import { Tabs, Card, Button, Typography, Pagination, Modal } from "antd";
import discount from "../../../../assets/images/discount.png";
import { CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { ScrollToTop } from "../../../ultils/client";


const { Title, Text } = Typography;

const PromoCodePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("2");

  // Danh sách mã giảm giá
  const vouchers = {
    all: [
      {
        title: "Voucher 50K",
        description: "Giảm 50k cho đơn từ 999k",
        code: "GIAM50",
        expiry: "2024-10-31",
      },
      {
        title: "Voucher 80K",
        description: "Giảm 80k cho đơn từ 399k",
        code: "BANMOI80",
        expiry: "2024-10-31",
      },
    ],
    online: [
      {
        title: "Voucher 80K",
        description: "Giảm 80k cho đơn từ 399k",
        code: "BANMOI80",
        expiry: "2024-10-31",
      },
    ],
    store: [], // Không có mã giảm giá nào cho cửa hàng
  };

  const tabItems = [
    { key: "1", label: `Tất cả (${vouchers.all.length})` },
    { key: "2", label: `Online (${vouchers.online.length})` },
    { key: "3", label: `Cửa hàng (${vouchers.store.length})` },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Lấy danh sách mã giảm giá theo tab hiện tại
  const currentVouchers =
    activeTab === "1"
      ? vouchers.all
      : activeTab === "2"
        ? vouchers.online
        : vouchers.store;

  return (
    <>
      <div className="p-6">
        <Typography.Title level={3}>Mã ưu đãi</Typography.Title>

        {/* Tabs for Voucher Categories */}
        <Tabs
          defaultActiveKey="2"
          items={tabItems}
          onChange={handleTabChange}
          tabBarStyle={{
            color: "#2AB573", // Màu xanh lá cho tất cả các tab
          }}
          className="ant-tabs-green"
        />

        {/* List of Vouchers */}
        <div className="mt-4">
          <Typography.Text className="font-semibold">
            Mã ưu đãi của bạn:
          </Typography.Text>

          {/* Vouchers */}
          <div className="flex justify-center items-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {currentVouchers.length > 0 ? (
                currentVouchers.map((voucher, index) => (
                  <Card key={index} className="shadow-md w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong className="text-lg">
                          {voucher.title}
                        </Text>
                        <p className="text-gray-500">{voucher.description}</p>
                        <Text className="text-gray-400">
                          HSD: {voucher.expiry}
                        </Text>
                        <Button
                          type="link"
                          className="ml-4"
                          onClick={showModal}
                          style={{ color: "#2AB573" }}
                        >
                          Điều kiện
                        </Button>
                      </div>
                      <div>
                        <Text className="bg-gray-100 px-2 py-1 rounded-md">
                          {voucher.code}
                        </Text>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-end">
                      <Button type="primary" style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }} className="bg-blue-500">
                        Mua ngay
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className=" flex col-span-3 flex-col justify-center items-center">
                  <img
                    src={discount}
                    alt="No Vouchers"
                    className="mb-4"
                  />
                  <Text className="text-gray-500 text-center">
                    Rất tiếc! Bạn chưa có mã giảm giá nào.
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination defaultCurrent={1} total={50} />
        </div>
        <Modal
          title="Chi tiết mã ưu đãi"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          closeIcon={<CloseOutlined />}
          centered
          className="p-0"
        >
          <div className="p-4">
            <Title level={4} className="text-center">
              VOUCHER 50.000 ₫
            </Title>
            <div className="flex flex-col items-center my-4">
              <img
                src="https://via.placeholder.com/200x80?text=Barcode" // Đây là hình barcode placeholder, bạn có thể thay bằng ảnh thật
                alt="barcode"
                className="mb-2"
              />
              <div className="flex items-center space-x-2">
                <Text className="text-lg font-semibold">GIAM50</Text>
                <CopyOutlined className="cursor-pointer text-lg" />
              </div>
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            <ul className="list-none text-sm text-gray-600">
              <li>- Hạn sử dụng: 1/10 – 31/10/2024.</li>
              <li>- Địa điểm áp dụng: Web, App.</li>
              <li>- Áp dụng cho toàn bộ sản phẩm.</li>
              <li>- Áp dụng giảm thêm 50k cho hóa đơn từ 999k.</li>
              <li>- Không áp dụng đồng thời với các voucher khác.</li>
              <li>- Áp dụng 01 mã ưu đãi / 01 hóa đơn.</li>
              <li>- Áp dụng cùng VIP, tích điểm cho các hạng.</li>
            </ul>
            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                className="h-10 w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PromoCodePage;
