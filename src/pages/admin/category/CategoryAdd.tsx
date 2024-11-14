
import { Button, Card, Form, Input, notification } from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { FormProps } from "antd/lib";
import { addCategory } from "../../../services/categoryServices";
import { useMutation } from "@tanstack/react-query";
import { CategoryRequest } from "../../../common/types/Category";
const listHis = [{ link: "/admin/category", name: "Danh mục" }];
type FieldType = {
  name: string
};
const CategoryAdd = () => {

  const [form] = Form.useForm();

  // function
  const { mutate } = useMutation({
    mutationFn: (data: CategoryRequest) => addCategory(data),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        duration: 2,
      });
      form.resetFields();
    },
    onError: () => {
      notification.error({
        message: "Thất bị. Xin thử được thêm",
        duration: 2,
      });
    },
  });
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    mutate(values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
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
            label="Loại"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục",
              },
            ]}
          >
            <Input type="text" placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryAdd;
