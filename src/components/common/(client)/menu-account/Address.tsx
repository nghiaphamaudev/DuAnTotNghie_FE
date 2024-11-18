import { Button, Flex, Spin, Typography } from "antd";
import React, { useState } from "react";

import { AddressRequest } from "../../../../common/types/Address";
import { useAuth } from "../../../../contexts/AuthContext";
import AddressModal from "./ModalAdress";
import { LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AddressComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<
    AddressRequest | undefined
  >(undefined);
  const { userData, addMyAddress, updateMyAddress, deleteMyAddress, isFetching } = useAuth(); // Sử dụng hook để gọi addMyAddress từ AuthContext

  const handleSaveAddress = async (address: AddressRequest) => {
    if (editingAddress) {
      const newData = { ...address, id: editingAddress.id }
      await updateMyAddress(newData);
    } else {
      await addMyAddress(address);
    }
    setIsModalVisible(false);
  };

  const showModal = (address?: AddressRequest) => {
    if (isFetching) {
      return; // Không mở modal nếu đang trong quá trình loading
    }
    setIsModalVisible(true);
    setEditingAddress(address);
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
  };

  console.log(isFetching);
  return (
    <>
      {
        isFetching ? (
          <Flex align="center" gap="middle">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </Flex>
        ) : (
          <div className="p-6">
            <Title level={3}>Số địa chỉ</Title>
            {userData?.addresses?.map((address, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 relative mb-4"
              >
                <Title className="mb-4" level={4}>
                  {address.detailAddressReceiver},{" "}
                  {address.addressReceiver.ward.name},{" "}
                  {address.addressReceiver.district.name},{" "}
                  {address.addressReceiver.province.name}
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
              onClick={() => showModal()}
              style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
              className="w-full h-14 text-lg"
            >
              Thêm địa chỉ
            </Button>
            <AddressModal
              isModalVisible={isModalVisible}
              onClose={handleCancel}
              editingAddress={editingAddress}
              onSave={handleSaveAddress}
            />
          </div>
        )
      }
    </>
  );
};

export default AddressComponent;