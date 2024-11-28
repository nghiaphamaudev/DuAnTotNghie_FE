import { Button, Input, Radio, Form, Typography } from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import { User } from "../../../../common/types/User";
import { z } from "zod";
import { useState } from "react";
import { UserProfileSchema } from "./zod-menu";

const { Title } = Typography;

const UserProfile = () => {
    const { userData, updateUser } = useAuth();
    const [form] = Form.useForm();
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // Kiểu dữ liệu cho formErrors

    const validateForm = (values: User) => {
        const errors: { [key: string]: string } = {}; // Đối tượng để lưu lỗi

        // Xác thực từng trường với Zod
        try {
            UserProfileSchema.parse(values);
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach(err => {
                    if (err.path.length > 0) {
                        errors[err.path[0]] = err.message; // Lưu lỗi vào đối tượng theo tên trường
                    }
                });
            }
        }
        // Cập nhật trạng thái lỗi
        setFormErrors(errors); 
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };

    const onFinish = async (values: User) => {
        const isValid = validateForm(values);
        if (isValid) {
            await updateUser({ ...userData, ...values });
        }
    };

    return (
        <div className="p-6">
            <Title level={3}>Thông tin tài khoản</Title>
            {userData && (
                <Form
                    layout="vertical"
                    className="space-y-6"
                    form={form}
                    onFinish={onFinish}
                    initialValues={{
                        gender: userData.gender || "Khác",
                        fullName: userData.fullName,
                        phoneNumber: userData.phoneNumber,
                        email: userData.email,
                    }}
                    onValuesChange={(_, values) => {
                        // Kiểm tra lỗi ngay khi giá trị thay đổi
                        validateForm(values);
                    }}
                >
                    <Form.Item
                        label={<span className="block text-md font-semibold text-black-500 mb-2">Giới tính</span>}
                        name="gender"
                        // Thay đổi trạng thái hiển thị
                    >
                        <Radio.Group className="flex">
                            <Radio className="block text-md font-semibold text-black-400 mb-2" value="Nam">Nam</Radio>
                            <Radio className="block text-md font-semibold text-black-400 mb-2" value="Nữ">Nữ</Radio>
                            <Radio className="block text-md font-semibold text-black-400 mb-2" value="Khác">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label={<span className="block text-md font-semibold text-black-500 mb-2">Họ tên</span>}
                        name="fullName"
                        help={formErrors.fullName} // Hiển thị thông báo lỗi nếu có
                        validateStatus={formErrors.fullName ? 'error' : undefined} // Thay đổi trạng thái hiển thị
                    >
                        <Input
                            placeholder="Nhập họ tên"
                            className="h-12 block text-md font-semibold text-black-400 mb-2"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="block text-md font-semibold text-black-500 mb-2">Số điện thoại</span>}
                        name="phoneNumber"
                        help={formErrors.phoneNumber} // Hiển thị thông báo lỗi nếu có
                        validateStatus={formErrors.phoneNumber ? 'error' : undefined} // Thay đổi trạng thái hiển thị
                    >
                        <Input
                            placeholder="Nhập số điện thoại"
                            className="h-12 block text-md font-semibold text-black-400 mb-2"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="block text-md font-semibold text-black-500 mb-2">Email</span>}
                        name="email"
                    >
                        <Input readOnly placeholder="Nhập email" className="h-12 block text-md font-semibold text-black-400 mb-2" />
                    </Form.Item>

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
            )}
        </div>
    );
};

export default UserProfile;
