
import { Button, Card, Form, Input } from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
const listHis = [{ link: "/admin/category", name: "Danh mục" }];
const CategoryEdit = () => {

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Tạo mới Danh mục"} listLink={listHis} />
      <Card bordered={false}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          style={{ maxWidth: 800 }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Loại"
            name="loai"
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

export default CategoryEdit;
