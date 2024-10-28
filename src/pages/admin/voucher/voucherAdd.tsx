import {
  Button,
  Form,
  Input,
  Select,
  Card,
  DatePicker,
} from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import dayjs from "dayjs";

const VoucherAdd = () => {
  return (
    <div className="">
      <BreadcrumbsCustom nameHere={"Thêm mã giảm giá"} listLink={[]} />
      <Form
        name="basic"
        autoComplete="off"
      >
        <div className="w-75 mx-auto">
          <Card>
            <Form.Item
              label="Mã giảm giá"
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã giảm giá!" }]}
            >
              <Input placeholder="Mã giảm giá" />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input placeholder="Mô tả ngắn" />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              label="Kiểu"
              name="discountType"
              rules={[{ required: true, message: "Vui lòng chọn kiểu!" }]}
            >
              <Select
                defaultValue=""
                style={{ width: 850 }}
                options={[
                  { value: "percentage", label: "%" },
                  { value: "amount", label: "VNĐ" },
                ]}
              />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              label="Giảm"
              name="discountVal"
              dependencies={['discountType']}
              rules={[
                { required: true, message: "Vui lòng nhập!" },
                { min: 0, message: 'Giá trị phải là số dương', transform: val => Number(val) },
              ]}
            >
              <Input placeholder="Giảm" type="number" />
            </Form.Item>
          </Card>

          <Card>
            <div className="d-flex justify-content-around">
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
              >
                <DatePicker
                  showTime
                  disabledDate={date => dayjs(date).add(1, 'd').isBefore(dayjs())}
                />
              </Form.Item>

              <Form.Item
                label="Ngày kết thúc"
                name="expirationDate"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày kết thúc!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("startDate") < value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu!"));
                    },
                  }),
                ]}
              >
                <DatePicker
                  showTime
                  disabledDate={date => dayjs(date).add(1, 'd').isBefore(dayjs())}
                />
              </Form.Item>
            </div>
          </Card>

          <Card>
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[{ required: true, message: "Vui lòng nhập số lượng mã giảm giá!" }]}
            >
              <Input placeholder="Số lượng" type="number" />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item
              label="Giá trị đơn hàng tối thiểu"
              name="minPurchaseAmount"
              rules={[{ required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu!" }]}
            >
              <Input placeholder="Giá trị đơn hàng tối thiểu" type="number" />
            </Form.Item>
          </Card>

          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ float: "right", paddingRight: "25px", marginTop: "20px" }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default VoucherAdd;
