import { Button, Form, Input, notification, Typography } from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import { ResetPasswordRequest } from "../../../../common/types/User";
import { useParams } from "react-router-dom";

const { Title } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const { resetMyPassword } = useAuth();
  const { resetToken } = useParams<{ resetToken: string }>();

  const handleSubmit = async (values: {
    password: string;
    passwordConfirm: string;
  }) => {
    if (!resetToken) {
      notification.error({
        message: "Không tìm thấy token",
        placement: "topRight",
      });
      return;
    }
    const formData: ResetPasswordRequest = {
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    };
    await resetMyPassword({ formData, resetToken });
    form.resetFields();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px", // Giới hạn chiều ngang form
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Đặt lại mật khẩu
        </Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải dài ít nhất 6 ký tự" },
              {
                pattern: /[a-z]/,
                message: "Mật khẩu ít nhất phải có một chữ thường",
              },
              {
                pattern: /[A-Z]/,
                message: "Mật khẩu ít nhất phải có một chữ hoa",
              },
              {
                pattern: /[\d]/,
                message: "Mật khẩu ít nhất phải có một số",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" className="h-12" />
          </Form.Item>

          <Form.Item
            name="passwordConfirm"
            label="Nhập lại mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" className="h-12" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: "48px",
                fontSize: "16px",
                backgroundColor: "#2AB573",
                borderColor: "#2AB573",
                marginTop: "15px",
              }}
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
