import { Modal } from "antd";
import { useEffect, useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordModal = ({
  isModalOpen,
  handleCancel,
  handleOk,
}: {
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isModalOpen) {
      setIsEmailVerified(false);
      setEmail("");
    }
  }, [isModalOpen]);

  return (
    <Modal
      title={
        <div className="relative">
          <h2 className="text-lg font-semibold">Quên mật khẩu</h2>
          <hr className="mt-2 border-t border-gray-300" />
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      maskClosable={true}
      onCancel={handleCancel}
      footer={null}
      styles={{ mask: { backgroundColor: "rgba(0, 0, 0, 0.7)" } }}
    >
      {!isEmailVerified ? (
        <ForgotPasswordForm
          setEmail={setEmail}
          setIsEmailVerified={setIsEmailVerified}
        />
      ) : (
        <div>
          <p className="text-center text-green-500 font-semibold">
            "Token đặt lại mật khẩu đã được gửi đến Email: {email} của bạn! Vui
            lòng kiểm tra hộp thư.
          </p>
        </div>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
