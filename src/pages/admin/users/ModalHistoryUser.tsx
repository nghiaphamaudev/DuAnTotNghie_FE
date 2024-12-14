import React from "react";
import { Modal, Button, Switch, Typography } from "antd";

const {Title} = Typography
interface ModalHistoryUserProps {
  isVisible: boolean;
  onCancel: () => void;
}

const ModalHistoryUser: React.FC<ModalHistoryUserProps> = ({
  isVisible,
  onCancel,
}) => {
  return (
    <Modal visible={isVisible} onCancel={onCancel} footer={null}>
      <Title level={4}>Lịch sử mua hàng</Title>
      <Title level={5}>Tháng này</Title>
      <Title level={5}>Tuần này</Title>

      <Title level={4}>Thông số</Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Tổng số đơn hàng đã thực hiện
        </Title>
        <span></span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Thành công
        </Title>
        <span>80</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Tỉ lệ
        </Title>
        <span>80%</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Hủy
        </Title>
        <span>10</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Tỉ lệ
        </Title>
        <span>10%</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Hoàn trả
        </Title>
        <span>5</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Tỉ lệ
        </Title>
        <span>5%</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Thiệt hại cửa hàng
        </Title>
        <span>2 triệu VNĐ</span>
      </div>

      <Title level={4}>Hành động</Title>
      <Button style={{ marginBottom: 16 }}>Cảnh báo</Button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Yêu cầu thanh toán trước
        </Title>
        <Switch />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Khóa tài khoản tạm thời
        </Title>
        <Switch />
      </div>
    </Modal>
  );
};

export default ModalHistoryUser;
