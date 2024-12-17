import { Button, Card, Form, Input, notification, Upload, Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import { addCategory } from "../../../services/categoryServices";
import { CategoryRequest } from "../../../common/types/Category";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { message } from 'antd';
import { useState } from "react";


const listHis = [{ link: "/admin/category", name: "Danh mục" }];

type FieldType = {
  name: string;
  imageCategory: any[];
};

const CategoryAdd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Hàm mutate để gửi dữ liệu lên API
  const { mutate } = useMutation({
    mutationFn: (data: FormData) => addCategory(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        duration: 2,
      });
      form.resetFields();  // Reset form khi thêm xong
    },
    onError: () => {
      notification.error({
        message: "Thất bại. Xin thử lại",
        duration: 2,
      });
    },
    onMutate: () => {
      setLoading(true);  // Khi bắt đầu gửi, set loading
    },
    onSettled: () => {
      setLoading(false);  // Sau khi hoàn thành (thành công hoặc thất bại), tắt loading
    },
  });

  const onFinish = async (values: FieldType) => {
    const formData = new FormData();
    formData.append("name", values.name);

    // Kiểm tra và append tệp ảnh vào FormData
    if (values.imageCategory && values.imageCategory.length > 0) {
      formData.append('imageCategory', values.imageCategory[0].originFileObj);
    } else {
      message.error('Ảnh danh mục là bắt buộc.');
      return;
    }

    try {
      // Gửi yêu cầu POST với FormData
      const response = await fetch('http://127.0.0.1:8000/api/v1/categories', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Kiểm tra phản hồi từ server
      if (response.ok) {
        message.success('Danh mục đã được tạo thành công!');
        form.resetFields();  // Reset form sau khi thành công
      } else {
        message.error(data.message || 'Có lỗi xảy ra khi tạo danh mục.');
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu form:", error);
      message.error('Có lỗi khi gửi yêu cầu.');
    }
  };

  const onFinishFailed = () => {
    notification.error({
      message: "Thất bại. Xin thử lại",
      duration: 2,
    });
  };

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Tạo mới Danh mục"} listLink={listHis} />
      <Card bordered={false}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" },
            {
              pattern: /^(?!.*^(?:\p{L}+|\p{N}+)$)[\p{L}\p{N}\s\p{P}\p{S}]{3,}$/u,
              message: "Tên danh mục phải có ít nhất 3 ký tự gồm chữ cái và số",
            },
            ]}
          >
            <Input type="text" placeholder="Nhập tên danh mục" />
          </Form.Item>

          {/* Trường upload ảnh */}
          <Form.Item
            label="Ảnh danh mục"
            name="imageCategory"
            valuePropName="file"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: 'Vui lòng tải lên ảnh bìa!' }]}
          >
            <Upload
              name="imageCategory"
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1}
              accept=".jpg,.png,.jpeg"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo danh mục
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryAdd;
