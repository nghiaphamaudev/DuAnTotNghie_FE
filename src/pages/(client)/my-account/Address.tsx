import React, { useState } from "react";
import { Button, Typography } from "antd";
// Import AddressModal
// Cập nhật import
import AddressModal from "./ModalAdress";
import { Address } from "../../../common/types/User";

const { Title } = Typography;

const AddressComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(
    undefined
  );
  const [addresses, setAddresses] = useState<Address[]>([
    {
      address: "12121, Thị xã Sơn Tây, Hà Nội",
      name: "Tùng Chu",
      phone: "09799971751",
    },
  ]);

  const showModal = () => {
    setIsModalVisible(true);
    setEditingAddress(undefined); // Reset địa chỉ khi thêm mới
  };

  const showEditModal = (addressData: Address) => {
    setEditingAddress(addressData);
    setIsModalVisible(true);
  };

  const handleSaveAddress = (newAddress: Address) => {
    if (editingAddress) {
      // Cập nhật địa chỉ đã chỉnh sửa
      const updatedAddresses = addresses.map((addr) =>
        addr.address === newAddress.address ? newAddress : addr
      );
      setAddresses(updatedAddresses);
    } else {
      // Thêm địa chỉ mới
      setAddresses([...addresses, newAddress]);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-6">
      <Title level={3}>Số địa chỉ</Title>

      {addresses.map((addressData, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 relative mb-4"
        >
          <Title className="mb-4" level={4}>
            {addressData.address}
          </Title>

          <Title className="mb-4 text-sm" level={5}>
            {addressData.name} | {addressData.phone}
          </Title>

          <div className="flex justify-between">
            <Button
              className="absolute top-4 right-4 text-blue-600"
              onClick={() => showEditModal(addressData)}
              style={{ color:"#2AB573",borderColor: "#2AB573" }}
            >
              Sửa
            </Button>
          </div>
          {addressData.defaultAddress && (
            <div className="mb-4 text-red-500 text-sm">Địa chỉ mặc định</div>
          )}
        </div>
      ))}

      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
        className="w-full h-14 text-lg"
      >
        Thêm địa chỉ
      </Button>

      {/* Sử dụng AddressModal */}
      <AddressModal
        isVisible={isModalVisible}
        onClose={handleCancel}
        onSave={handleSaveAddress}
        editingAddress={editingAddress} // Truyền địa chỉ đang chỉnh sửa nếu có
      />
    </div>
  );
};

export default AddressComponent;
