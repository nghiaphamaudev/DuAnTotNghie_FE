import React from "react";
import { Button, DatePicker, Input, Radio, Form, Typography } from "antd";

const { Title, Text } = Typography;

const UserProfile = () => {
  return (
    <>
      <div className="p-6">
        <Title level={3}>Thông tin tài khoản</Title>

        <Form layout="vertical" className="space-y-6">
          <Form.Item
            label={<span className="text-black-500">Giới tính</span>}
            name="gender"
          >
            <Radio.Group>
              <Radio className="text-black-400" value="male">
                Nam
              </Radio>
              <Radio className="text-black-400" value="female">
                Nữ
              </Radio>
              <Radio className="text-black-400" value="other">
                Khác
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="text-black-500">Họ tên</span>}
            name="fullName"
          >
            <Input placeholder="Nhập họ tên" className="h-12" />
          </Form.Item>

          <Form.Item
            label={<span className="text-black-500">Số điện thoại</span>}
            name="phone"
          >
            <Input placeholder="Nhập số điện thoại" className="h-12" />
          </Form.Item>

          <Form.Item
            label={<span className="text-black-500">Email</span>}
            name="email"
          >
            <Input placeholder="Nhập email" className="h-12" />
          </Form.Item>

          <Form.Item
            label={<span className="text-black-500">Ngày sinh</span>}
            name="birthday"
          >
            <DatePicker className="w-full h-12" placeholder="Chọn ngày sinh" />
          </Form.Item>

          <Text className="text-black-400 text-sm">
            Cập nhật ngày sinh để hưởng các ưu đãi trong tháng sinh nhật.
          </Text>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-14 text-lg"
              style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default UserProfile;
