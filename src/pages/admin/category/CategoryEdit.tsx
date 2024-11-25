import { Button, Card, Form, Input, notification, Upload, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { updateCategory } from "../../../services/categoryServices";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Thêm useParams để lấy id từ URL
import { PlusOutlined } from "@ant-design/icons";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";

const listHis = [{ link: "/admin/category", name: "Danh mục" }];

type FieldType = {
  name: string;
  imageCategory: any[]; // Dữ liệu ảnh
};

const CategoryEdit = () => {
  const { id } = useParams<{ id: string | undefined }>(); // Lấy id từ URL
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/categories/detail/${id}`);
        const data = await response.json();

        console.log('Dữ liệu từ API:', data);  // Kiểm tra cấu trúc dữ liệu trả về từ API

        if (response.ok) {
          // Kiểm tra nếu có imageCategory và thiết lập fileList trong form
          const imageCategory = data.data?.imageCategory || null;
          const imageUrl = imageCategory ? [{
            uid: imageCategory,  // UID có thể là một chuỗi hoặc ID
            name: "Danh mục ảnh", // Tên có thể tùy chỉnh
            url: imageCategory,  // Đảm bảo URL hợp lệ
          }] : [];

          form.setFieldsValue({
            name: data.data?.name,
            imageCategory: imageUrl,  // Cập nhật imageCategory cho fileList
          });
        } else {
          message.error(data.message || 'Không thể tải dữ liệu danh mục.');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
        message.error('Có lỗi khi tải dữ liệu danh mục.');
      }
    };

    fetchCategoryData();
  }, [id, form]);

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => updateCategory(data, id), // Truyền id vào hàm updateCategory
    onSuccess: () => {
      notification.success({
        message: "Cập nhật thành công",
        duration: 2,
      });
      form.resetFields();
    },
    onError: () => {
      notification.error({
        message: "Cập nhật thất bại. Xin thử lại",
        duration: 2,
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
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
      mutate(formData);
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
      <BreadcrumbsCustom nameHere={"Cập nhật Danh mục"} listLink={listHis} />
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
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]} >
            <Input type="text" placeholder="Nhập tên danh mục" />
          </Form.Item>

          {/* Trường upload ảnh */}
          <Form.Item
            label="Ảnh danh mục"
            name="imageCategory"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: 'Vui lòng tải lên ảnh bìa!' }]}>
            <Upload
              name="imageCategory"
              listType="picture-card"
              beforeUpload={() => false}  // Không upload ngay lập tức
              maxCount={1}
              accept=".jpg,.png,.jpeg"
              fileList={form.getFieldValue("imageCategory") || []}  // Sử dụng fileList thay vì defaultFileList
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật danh mục
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryEdit;
