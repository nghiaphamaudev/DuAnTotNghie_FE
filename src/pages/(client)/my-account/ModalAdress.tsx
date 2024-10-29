import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Checkbox, Row, Col } from "antd";
import axios from "axios";
import { Address, District, Province, Ward } from "../../../common/types/User";

const { Option } = Select;

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  editingAddress?: Address; // Nếu đang chỉnh sửa, có thể truyền địa chỉ đã chỉnh sửa
}

const AddressModal: React.FC<AddressModalProps> = ({
  isVisible,
  onClose,
  onSave,
  editingAddress,
}) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Lấy danh sách tỉnh/thành phố từ API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get<Province[]>(
          "https://provinces.open-api.vn/api/"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleCityChange = async (cityCode: string) => {
    setDistricts([]);
    setWards([]);
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      );
      setDistricts(response.data.districts);
      form.setFieldsValue({ district: undefined, ward: undefined });
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setWards([]);
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);
      form.setFieldsValue({ ward: undefined });
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  // Thiết lập giá trị cho form khi modal mở
  useEffect(() => {
    if (editingAddress) {
      form.setFieldsValue({
        ...editingAddress,
      });
    } else {
      form.resetFields();
    }
  }, [editingAddress, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newAddress: Address = {
          address: values.detailedAddress,
          name: values.name,
          phone: values.phone,
          city: values.city,
          district: values.district,
          ward: values.ward,
          detailedAddress: values.detailedAddress,
          addressType: values.addressType,
          defaultAddress: values.defaultAddress,
        };
        onSave(newAddress);
        onClose();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Thêm địa chỉ mới"
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Họ tên">
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="Tỉnh / Thành phố">
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleCityChange}
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="district" label="Quận / Huyện">
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
              >
                {districts.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="ward" label="Phường / Xã">
              <Select placeholder="Chọn phường/xã">
                {wards.map((ward) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="detailedAddress" label="Địa chỉ chi tiết">
              <Input placeholder="Tòa nhà, số nhà, tên đường" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="defaultAddress" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>
        <Button
          type="primary"
          onClick={handleOk}
          className="w-full"
          style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
        >
          Lưu địa chỉ
        </Button>
      </Form>
    </Modal>
  );
};

export default AddressModal;
