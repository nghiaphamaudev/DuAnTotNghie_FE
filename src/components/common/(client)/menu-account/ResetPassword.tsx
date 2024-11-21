import { useState } from "react";
import { Button, Form, Input, Typography, Modal, message, notification } from "antd";

const { Title } = Typography;

const ResetPassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // Lưu mật khẩu hiện tại

  // Xử lý khi người dùng nhấn "Lưu thay đổi" để gửi yêu cầu OTP
  const handlePasswordSubmit = () => {
    if (currentPassword) {
      // Kiểm tra mật khẩu hiện tại
      message.success("Mật khẩu hiện tại chính xác. Vui lòng nhập mã OTP để xác nhận.");
      setIsModalVisible(true); // Hiển thị modal nhập OTP
    } else {
      message.error("Vui lòng nhập mật khẩu hiện tại.");
    }
  };

  // Xử lý khi người dùng nhập mã OTP và xác nhận mật khẩu mới
  const handleOtpSubmit = () => {
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới không khớp.");
      return;
    }

    if (otp) { // Kiểm tra mã OTP
      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được thay đổi thành công.",
      });

      // Console log các giá trị thay vì gửi đến backend
      console.log("Mật khẩu hiện tại:", currentPassword);
      console.log("Mật khẩu mới:", newPassword);
      console.log("Xác nhận mật khẩu:", confirmPassword);
      console.log("Mã OTP:", otp);

      setIsModalVisible(false); // Ẩn modal
    } else {
      message.error("Vui lòng nhập mã OTP.");
    }
  };

  return (
    <>
      <div className="p-6">
        <Title level={3}>Đổi mật khẩu</Title>

        <Form layout="vertical" className="space-y-6" onFinish={handlePasswordSubmit}>
          <Form.Item label={<span className="text-black-500">Mật khẩu hiện tại</span>}>
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại"
              className="h-12"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span className="text-black-500">Mật khẩu mới</span>}>
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              className="h-12"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label={<span className="text-black-500">Nhập lại mật khẩu</span>}>
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              className="h-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }} className="w-full h-14 text-lg">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title="Xác thực mã OTP"
        visible={isModalVisible}
        onOk={handleOtpSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập mã OTP"
          className="h-12"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default ResetPassword;
