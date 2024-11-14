import { Button, Typography } from "antd";
import React, { useState } from "react";

import { AddressRequest } from "../../../../common/types/Address";
import { useAuth } from "../../../../contexts/AuthContext";
import AddressModal from "./ModalAdress";

const { Title } = Typography;

const AddressComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<
    AddressRequest | undefined
  >(undefined);
  const { userData, addMyAddress,updateMyAddress, deleteMyAddress } = useAuth(); // Sử dụng hook để gọi addMyAddress từ AuthContext

  const handleSaveAddress = async (address: AddressRequest) => {
    if (editingAddress) {
      await updateMyAddress(editingAddress.id, address);
    } else {
      await addMyAddress(address);
    }
    setIsModalVisible(false); // Đóng modal sau khi lưu
  };

  const showModal = (address?: AddressRequest) => {
    setIsModalVisible(true);
    setEditingAddress(address); // Đặt địa chỉ chỉnh sửa về undefined để thêm mới
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };
  return (
    <div className="p-6">
      <Title level={3}>Số địa chỉ</Title>

      {userData?.addresses?.map((address, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 relative mb-4"
        >
          <Title className="mb-4" level={4}>
            {address.detailAddressReceiver},{" "}
            {address.addressReceiver.ward.wardName},{" "}
            {address.addressReceiver.district.districtName},{" "}
            {address.addressReceiver.province.provinceName}
          </Title>
          <Title className="mb-4 text-sm" level={5}>
            {address.nameReceiver} | {address.phoneNumberReceiver}
          </Title>
          <div className="flex justify-between">
          <Button
              className="absolute top-4 right-20 text-blue-600"
              onClick={() => showModal(address)}
              style={{ color: "#2AB573", borderColor: "#2AB573" }}
            >
              Sửa
            </Button>
            <Button
              danger
              className="absolute top-4 right-4"
              onClick={() => deleteMyAddress(address._id)}
              style={{ color: "#FF4D4F", borderColor: "#FF4D4F" }}
            >
              Xóa
            </Button>
            
          </div>
          
          {address.isDefault && (
            <div className="mb-4 text-red-500 text-sm">Địa chỉ mặc định</div>
          )}
        </div>
      ))}

      <Button
        type="primary"
        onClick={() => showModal()} // Mở modal để thêm địa chỉ mới
        style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
        className="w-full h-14 text-lg"
      >
        Thêm địa chỉ
      </Button>
      <AddressModal
        isVisible={isModalVisible}
        onClose={handleCancel}
        editingAddress={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

export default AddressComponent;