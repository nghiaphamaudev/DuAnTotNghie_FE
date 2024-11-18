import { Modal } from "antd";
import { useState } from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";

import ChangePasswordForm from "./ChangePasswordForm";
import OtpForm from "./OtpForm";

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
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [email, setEmail] = useState("");

  const resetStates = () => {
    setIsEmailVerified(false);
    setIsOTPVerified(false);
    setIsChangePassword(false);
  };

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
      ) : !isOTPVerified ? (
        <OtpForm
          email={email}
          setIsOTPVerified={setIsOTPVerified}
          setIsChangePassword={setIsChangePassword}
        />
      ) : isChangePassword ? (
        <ChangePasswordForm
          handleCancel={handleCancel}
          resetStates={resetStates} // Truyền hàm resetStates
          setIsChangePassword={setIsChangePassword} // Truyền setIsChangePassword
        />
      ) : null}
    </Modal>
  );
};

export default ForgotPasswordModal;
