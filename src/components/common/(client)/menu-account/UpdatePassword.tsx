import { Button, Form, Input, Typography } from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import { UpdatePasswordRequest } from "../../../../common/types/User";

const { Title } = Typography;

const UpdatePassword = () => {
  const [form] = Form.useForm();
  const { updateMyPassword } = useAuth();

  const handleSubmit = async (values: {
    passwordCurrent: string;
    password: string;
    passwordConfirm: string;
  }) => {
    const formData: UpdatePasswordRequest = {
      passwordCurrent: values.passwordCurrent,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    };
    await updateMyPassword(formData);
    form.resetFields();
  };

  return (
    <div className="p-6">
      <Title level={3}>Đổi mật khẩu</Title>

      <Form
        form={form}
        layout="vertical"
        className="space-y-6"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="passwordCurrent"
          label={<span className="block text-md font-semibold text-black-500 mb-2">Mật khẩu hiện tại</span>}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu hiện tại"
            className="h-12 text-md font-semibold "
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="block text-md font-semibold text-black-500 mb-2">Mật khẩu mới</span>}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải dài ít nhất 6 ký tự" },
            {
              pattern: /[a-z]/,
              message: "Mật khẩu ít nhất phải có một chữ thường",
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
          <Input.Password placeholder="Nhập mật khẩu mới" className="h-12 text-md font-semibold" />
        </Form.Item>

        <Form.Item
          name="passwordConfirm"
          label={<span className="block text-md font-semibold text-black-500 mb-2">Nhập lại mật khẩu</span>}
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
          <Input.Password placeholder="Nhập lại mật khẩu" className="h-12 text-md font-semibold" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#2AB573", borderColor: "#2AB573" }}
            className="w-full h-14 text-lg"
          >
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePassword;
