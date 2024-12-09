import { Button, Card, Form, Input, notification } from 'antd';
import { UpdatePasswordRequestAdmin } from '../../../common/types/User';
import BreadcrumbsCustom from '../../../components/common/(admin)/BreadcrumbsCustom';
import { useAuth } from '../../../contexts/AuthContext';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const {IupdatePasswordAdmin, userDataAdmin} = useAuth();
  
  

  const handleSubmit = async (values: {
    resetPassword: string;
    resetPasswordConfirm: string;
  }) => {

    const { resetPassword, resetPasswordConfirm } = values;

    // Kiểm tra xem mật khẩu mới và nhập lại mật khẩu có trùng khớp không
    if (resetPassword !== resetPasswordConfirm) {
      notification.error({
        message: 'Lỗi khi đổi mật khẩu',
        description: 'Mật khẩu nhập lại không khớp!',
      });
      return;
    }
    const formData: UpdatePasswordRequestAdmin = {
      
      resetPassword: values.resetPassword,
      resetPasswordConfirm: values.resetPasswordConfirm,
    };
    await IupdatePasswordAdmin(formData);
    form.resetFields();
  };
  return (
    <>
      <BreadcrumbsCustom listLink={[]} nameHere={"Đổi mật khẩu SuperAdmin và Admin"} />
      <Card style={{ border: "none" }}>
      <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            initialValue={userDataAdmin?.fullName}
          >
            <Input
              disabled
              className="h-12 block text-md font-semibold text-black-400 mb-2"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            name="resetPassword"
            label="Mật khẩu mới"
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
            hasFeedback
          >
            <Input.Password className='h-12' placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="resetPasswordConfirm"
            label="Nhập lại mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
            hasFeedback
            dependencies={['resetPassword']} 
            validator={(_, value) => {
              if (!value || value === form.getFieldValue('resetPassword')) {
                return Promise.resolve();
              }
              return Promise.reject('Mật khẩu nhập lại không khớp!');
            }}
          >
            <Input.Password className="h-12" placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default ChangePassword