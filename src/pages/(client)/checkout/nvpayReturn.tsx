import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import instance from "../../../config/axios";

const VNPayReturn: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const sendPaymentDataToBackend = async () => {
      const paymentData = Object.fromEntries(searchParams.entries());
      console.log("Payment data: ", paymentData);

      try {
        const response = await instance.get("/payments/vnpay_return", {
          params: paymentData
        });
        console.log("Response from backend: ", response.data);

        if (response.data.status) {
          if (paymentData.vnp_TransactionStatus === "00") {
            message.success("Thanh toán thành công!");
          } else {
            message.warning("Thanh toán thất bại!");
          }
        } else {
          message.error("Xử lý giao dịch thất bại từ backend.");
        }
      } catch (error) {
        console.error("Error sending data to backend: ", error);
        message.error("Không thể gửi thông tin thanh toán đến máy chủ!");
      }
    };

    sendPaymentDataToBackend();
  }, [location]);

  return <div>Đang xử lý thanh toán, vui lòng chờ...</div>;
};

export default VNPayReturn;
