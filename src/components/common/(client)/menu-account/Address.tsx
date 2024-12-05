import { Button, Dropdown, Flex, Popconfirm, Spin, Typography } from "antd";
import React, { useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd/lib";
import { Menu } from "lucide-react";
import { AddressRequest } from "../../../../common/types/Address";
import { useAuth } from "../../../../contexts/AuthContext";
import AddressModal from "./ModalAdress";

const { Title } = Typography;

const AddressComponent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<
    AddressRequest | undefined
  >(undefined);
  const {
    userData,
    addMyAddress,
    updateMyAddress,
    showDeleteModal,
    isPendingUpdateStatusAddress,
    updatestatusAddress,
    isFetching,
  } = useAuth();

  const handleSetDefault = async (address: AddressRequest) => {
    if (isPendingUpdateStatusAddress) return;
    await updatestatusAddress({ ...address, isDefault: true });
  };

  const handleSaveAddress = async (address: AddressRequest) => {
    if (editingAddress) {
      const newData = { ...address, id: editingAddress.id };
      await updateMyAddress(newData);
    } else {
      await addMyAddress(address);
    }
    setIsModalVisible(false);
  };

  const showModal = (address?: AddressRequest) => {
    if (isFetching) {
      return;
    }
    setIsModalVisible(true);
    setEditingAddress(address);
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {isFetching ? (
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      ) : (
        <div className="p-6">
          <Title level={3}>Số địa chỉ</Title>
          {userData?.addresses?.map((address, index) => {
            const items: MenuProps["items"] = [
              {
                key: "1",
                label: (
                  <span
                    onClick={() => showModal(address)}
                    className="text-blue-500 cursor-pointer"
                  >
                    Sửa
                  </span>
                ),
                icon: <EditOutlined style={{ color: "#2AB573" }} />,
              },
              {
                key: "2",
                label: (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa địa chỉ này?"
                    onConfirm={() => showDeleteModal(address.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <span className="text-red-500 cursor-pointer">Xóa</span>
                  </Popconfirm>
                ),
                icon: <DeleteOutlined style={{ color: "#FF4D4F" }} />,
              },
              {
                key: "3",
                label: (
                  <span
                    onClick={() => handleSetDefault(address)}
                    className="text-green-500 cursor-pointer"
                  >
                    Đặt làm địa chỉ mặc định
                  </span>
                ),
              },
            ];

            return (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 relative mb-4"
              >
                <Title
                  className="block text-md font-semibold text-black-500 mb-4"
                  level={4}
                >
                  {address.detailAddressReceiver},{" "}
                  {address.addressReceiver.ward.name},{" "}
                  {address.addressReceiver.district.name},{" "}
                  {address.addressReceiver.province.name}
                </Title>
                <Title className="mb-4 text-sm" level={5}>
                  {address.nameReceiver} | {address.phoneNumberReceiver}
                </Title>
                <div className="absolute top-4 right-4">
                  <div className="flex justify-end items-center gap-4 mt-4 md:mt-0">
                    <Dropdown menu={{ items }}>
                      <a onClick={(e) => e.preventDefault()}>
                        <div className="font-semibold text-sm cursor-pointer">
                          <Menu size={16} />
                        </div>
                      </a>
                    </Dropdown>
                  </div>
                </div>
                {address.isDefault && (
                  <div className="block text-sm font-light text-red-500 mb-4">
                    Địa chỉ mặc định
                  </div>
                )}
              </div>
            );
          })}

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
      )}
    </>
  );
};

export default AddressComponent;
