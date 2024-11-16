import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  AddressRequest,
  District,
  Province,
  Ward,
} from "../../../../common/types/Address";
import { useAuth } from "../../../../contexts/AuthContext";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

interface AddressModalProps {
  isModalVisible: boolean;
  onClose: () => void;
  onSave: (address: AddressRequest) => void;
  editingAddress?: AddressRequest;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isModalVisible,
  onClose,
  onSave,
  editingAddress,
}) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // context
  const { isFetching, isPendingAddAddress, isPendingUpdateAddress } = useAuth();

  //lifecycle
  useEffect(() => {
    fetchData();
    loadEditingData();
  }, [editingAddress, form]);

  const fetchData = async () => {
    try {
      const [provincesResponse, districtsResponse, wardsResponse] = await Promise.all([
        handleCityChange(""), // API lấy danh sách tỉnh/thành phố
        handleDistrictChange(""), // API lấy danh sách quận/huyện
        handleWardChange(""), // API lấy danh sách phường/xã
      ]);

      // Cập nhật state
      if (provincesResponse) {
        setProvinces(provincesResponse.data);
      }
      if (districtsResponse) {
        setDistricts(districtsResponse.data);
      }
      if (wardsResponse) {
        setWards(wardsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách địa phương.",
      });
    }
  };

  const loadEditingData = async () => {
    if (editingAddress) {
      if (editingAddress.addressReceiver?.province?.code) {
        await handleCityChange(editingAddress.addressReceiver.province.code);
      }

      if (editingAddress.addressReceiver?.district?.code) {
        await handleDistrictChange(editingAddress.addressReceiver.district.code);
      }

      // Finally set the ward
      if (editingAddress.addressReceiver?.ward?.code) {
        await handleWardChange(editingAddress.addressReceiver.ward.code);
      }

      form.setFieldsValue({
        name: editingAddress.nameReceiver,
        phone: editingAddress.phoneNumberReceiver,
        province: editingAddress.addressReceiver?.province?.code,
        district: editingAddress.addressReceiver?.district?.code,
        ward: editingAddress.addressReceiver?.ward?.code,
        detailAddressReceiver: editingAddress.detailAddressReceiver,
        defaultAddress: editingAddress.isDefault,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCityChange = async (cityCode: string) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      );
      setDistricts(response.data.districts);
      setWards([]); // Clear wards when city changes

      form.setFieldsValue({
        district: undefined,
        ward: undefined,
        provinceName: response.data.name,
      });
      return response
    } catch (error) {
      console.error("Error fetching districts:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách quận/huyện.",
      });
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);

      form.setFieldsValue({
        ward: undefined,
        districtName: response.data.name,
      });
      return response
    } catch (error) {
      console.error("Error fetching wards:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách phường/xã.",
      });
    }
  };

  const handleWardChange = async (wardCode: string) => {
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/w/${wardCode}?depth=2`
      );
      form.setFieldsValue({
        wardName: response.data.name,
      });
      return response
    } catch (error) {
      console.error("Error fetching ward:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải tên phường/xã.",
      });
    }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newAddress: AddressRequest = {
        nameReceiver: values.name,
        phoneNumberReceiver: values.phone,
        addressReceiver: {
          province: {
            code: String(values.province ?? ''),
            name: values.provinceName || undefined,
          },
          district: {
            code: String(values.district ?? ''),
            name: values.districtName || undefined,
          },
          ward: {
            code: String(values.ward ?? ''),
            name: values.wardName || undefined,
          },
        },
        detailAddressReceiver: values.detailAddressReceiver,
        isDefault: values.defaultAddress || false,
      };

      await onSave(newAddress);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  return (
    <>
      {
        isFetching ? (
          <>
            <Flex align="center" gap="middle">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </Flex>
          </>

        ) : (
          <Modal
            title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            open={isModalVisible}
            onCancel={onClose}
            footer={null}
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Họ tên"
                    rules={[{ required: true, message: "Tên là bắt buộc" }]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Số điện thoại là bắt buộc" }]}
                  >
                    <Input placeholder="Nhập số điện thoại" maxLength={11} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="province"
                    label="Tỉnh / Thành phố"
                    rules={[{ required: true, message: "Tỉnh/Thành phố là bắt buộc" }]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành phố"
                      onChange={handleCityChange}
                    >
                      {provinces?.map((province) => (
                        <Option key={province.code} value={province.code.toString()}>
                          {province.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="district"
                    label="Quận / Huyện"
                    rules={[{ required: true, message: "Quận/Huyện là bắt buộc" }]}
                  >
                    <Select
                      placeholder="Chọn quận/huyện"
                      onChange={handleDistrictChange}
                    >
                      {districts?.map((district) => (
                        <Option key={district.code} value={district.code.toString()}>
                          {district.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="ward"
                    label="Phường / Xã"
                    rules={[{ required: true, message: "Phường/Xã là bắt buộc" }]}
                  >
                    <Select
                      placeholder="Chọn phường/xã"
                      onChange={handleWardChange}
                    >
                      {wards?.map((ward) => (
                        <Option key={ward.code} value={ward.code.toString()}>
                          {ward.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="detailAddressReceiver"
                    label="Địa chỉ chi tiết"
                    rules={[{ required: true, message: "Địa chỉ chi tiết là bắt buộc" }]}
                  >
                    <Input placeholder="Tòa nhà, số nhà, tên đường" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="defaultAddress" valuePropName="checked">
                <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
              </Form.Item>
              <Button
                disabled={isPendingAddAddress || isPendingUpdateAddress}
                type="primary"
                onClick={onSubmit}
                className="w-full"
                style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
              >
                Lưu địa chỉ
              </Button>
            </Form>
          </Modal>
        )
      }

    </>

  );
};

export default AddressModal;