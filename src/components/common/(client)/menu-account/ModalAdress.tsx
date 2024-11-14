/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  AddressRequest,
  District,
  Province,
  Ward,
} from "../../../../common/types/Address";

const { Option } = Select;

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (address: AddressRequest) => void;
  editingAddress?: AddressRequest;
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


  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get<Province[]>(
          "https://provinces.open-api.vn/api/"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách tỉnh/thành phố.",
        });
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const loadDataForEditingAddress = async () => {
      if (editingAddress) {
        form.setFieldsValue({
          name: editingAddress.nameReceiver,
          phone: editingAddress.phoneNumberReceiver,
          city: editingAddress.addressReceiver?.province?.code || undefined,
          district: editingAddress.addressReceiver?.district?.code || undefined,
          ward: editingAddress.addressReceiver?.ward?.code || undefined,
          detailAddressReceiver: editingAddress.detailAddressReceiver,
          defaultAddress: editingAddress.isDefault,
        });
  
        if (editingAddress.addressReceiver?.province?.code) {
          // Tải danh sách quận/huyện cho tỉnh đã chọn
          await handleCityChange(editingAddress.addressReceiver?.province?.code);
        }
  
        if (editingAddress.addressReceiver?.district?.code) {
          // Tải danh sách phường/xã cho quận đã chọn
          await handleDistrictChange(editingAddress.addressReceiver?.district?.code);
        }
      } else {
        form.resetFields(); // Reset form khi thêm mới
      }
    };
  
    loadDataForEditingAddress();
  }, [editingAddress, form]);
  console.log(editingAddress);
  

  const handleCityChange = async (cityCode: string) => {
    setDistricts([]);
    setWards([]);
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/p/${cityCode}?depth=2`
      );
      setDistricts(response.data.districts);
      // Lưu lại tên của tỉnh/thành phố
      form.setFieldsValue({
        district: undefined,
        ward: undefined,
        provinceName: response.data.name,
      });
    } catch (error) {
      console.error("Error fetching districts:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách quận/huyện.",
      });
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setWards([]);
    try {
      const response = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(response.data.wards);
      // Lưu lại tên của quận/huyện
      form.setFieldsValue({
        ward: undefined,
        districtName: response.data.name,
      });
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
      // Lưu lại tên của phường/xã
      form.setFieldsValue({
        wardName: response.data.name,
      });
    } catch (error) {
      console.error("Error fetching ward:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải tên phường/xã.",
      });
    }
  };

  

  const onSubmit = async () => {
    const values = await form.validateFields();

    const newAddress: AddressRequest = {
      _id: editingAddress?.id,
      nameReceiver: values.name,
      phoneNumberReceiver: values.phone,
      addressReceiver: {
        province: {
          code: values.province ? String(values.province) : undefined,
          provinceName: values.provinceName || undefined,
        },
        district: {
          code: values.district ? String(values.district) : undefined,
          districtName: values.districtName || undefined,
        },
        ward: {
          code: values.ward ? String(values.ward) : undefined,
          wardName: values.wardName || undefined,
        },
      },
      detailAddressReceiver: values.detailAddressReceiver,
      isDefault: values.defaultAddress || false,
    };

    await onSave(newAddress); // Gọi hàm onSave khi hoàn tất
    form.resetFields();
  };
  

  return (
    <Modal
      title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      visible={isVisible}
      onOk={onSubmit}
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
              rules={[
                { required: true, message: "Tỉnh/Thành phố là bắt buộc" },
              ]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleCityChange}
              >
                {provinces && provinces.length > 0 ? (
                  provinces.map((province) => (
                    <Option key={province.code} value={province.code}>
                      {province.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>Không có dữ liệu</Option> // Trường hợp không có tỉnh/thành phố
                )}
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
                {districts && districts.length > 0 ? (
                  districts.map((district) => (
                    <Option key={district.code} value={district.code}>
                      {district.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>Không có dữ liệu</Option>
                )}
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
              <Select placeholder="Chọn phường/xã" onChange={handleWardChange}>
                {wards && wards.length > 0 ? (
                  wards.map((ward) => (
                    <Option key={ward.code} value={ward.code}>
                      {ward.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>Không có dữ liệu</Option>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="detailAddressReceiver"
              label="Địa chỉ chi tiết"
              rules={[
                { required: true, message: "Địa chỉ chi tiết là bắt buộc" },
              ]}
            >
              <Input placeholder="Tòa nhà, số nhà, tên đường" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="defaultAddress" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>
        <Button
          type="primary"
          onClick={onSubmit}
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
