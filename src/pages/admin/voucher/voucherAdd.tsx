/* eslint-disable @typescript-eslint/no-unused-vars */

import { BackwardFilled } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Select, DatePicker, message, FormProps, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useState } from "react";
import { IVoucher } from "../../../interface/Voucher";
import { addVoucher } from "../../../services/voucher";

const VoucherAddPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [discountType, setDiscountType] = useState<string | undefined>();

  const { mutate } = useMutation({
    mutationFn: async (voucher: IVoucher) => {
      try {
        const response = await addVoucher(voucher);
        if (response?.status !== 201) {
          throw new Error(response?.statusText);
        }
        return response;
      } catch (error) {
        throw new Error("Thêm voucher thất bại");
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Thêm voucher thành công",
      });
      form.resetFields();
      navigate("/admin/voucher");
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    },
  });

  const onFinish: FormProps<IVoucher>["onFinish"] = (values) => {
    const payload: IVoucher = {
      ...values,
      startDate: dayjs(values.startDate).toISOString(),
      expirationDate: dayjs(values.expirationDate).toISOString(),
    };

    if (payload.discountType === "percentage") {
      delete payload.discountAmount;
    } else if (payload.discountType === "amount") {
      delete payload.discountPercentage;
    }

    mutate(payload);
  };

  return (
    <div>
      {contextHolder}
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-semibold">Thêm Voucher</h1>
        <Button type="primary">
          <Link to={`/admin/voucher`}>
            <BackwardFilled /> Quay lại
          </Link>
        </Button>
      </div>
      <div className="w-75 mx-auto">
        <Form
          form={form} name="voucherForm"
          onFinish={onFinish}
          layout="vertical"
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >

          <Form.Item
            label="Mã giảm giá"
            name="code"
            style={{ width: 850 }}
            rules={
              [{ required: true, message: "Vui lòng nhập mã giảm giá!" },
                {
                  pattern: /^[\p{L}\p{N}\s]{6,}$/u,
                  message: "Tên mã giảm giá phải có ít nhất 6 ký tự gồm chữ cái và số",
                }
              ]}
          >
            <Input placeholder="Mã giảm giá" />
          </Form.Item>



          <Form.Item
            label="Mô tả"
            name="description"
            style={{ width: 850 }}
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }
            ]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả ngắn" />
          </Form.Item>



          <Form.Item
            label="Kiểu"
            name="discountType"
            rules={[{ required: true, message: "Vui lòng chọn kiểu!" }]}
          >
            <Select
              onChange={(value) => setDiscountType(value)}
              style={{ width: 850 }}
              options={[
                { value: "percentage", label: "%" },
                { value: "amount", label: "VNĐ" },
              ]}
            />
          </Form.Item>


          {discountType === "percentage" && (

            <Form.Item
              label="Phần trăm giảm giá"
              name="discountPercentage"
              style={{ width: 850 }}
              rules={[
                { required: true, message: "Vui lòng nhập!" },
                { min: 0, message: 'Giá trị phải là số dương', transform: val => Number(val) },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const discountType = getFieldValue('discountType');

                    if (discountType === 'percentage' && value > 20) {
                      return Promise.reject('Phần trăm giảm giá nhỏ hơn 20%');
                    }

                    return Promise.resolve();
                  },
                })
              ]}
            >
              <Input placeholder="Phần trăm giảm giá" type="number" />
            </Form.Item>

          )}

          {discountType === "amount" && (

            <Form.Item
              label="Số tiền giảm giá"
              name="discountAmount"
              style={{ width: 850 }}
              rules={[
                { required: true, message: "Vui lòng nhập!" },
                { min: 0, message: 'Giá trị phải là số dương', transform: val => Number(val) },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const discountType = getFieldValue('discountType');

                    if (discountType === 'amount' && value > 100) {
                      return Promise.reject('Giảm giá tiền phải nhỏ hơn 100.000');
                    }

                    return Promise.resolve();
                  },
                })
              ]}
            >
              <Input placeholder="Số tiền giảm giá" type="number" />
            </Form.Item>

          )}


          <div className="d-flex justify-content-around">
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              style={{ width: 850 }}
              rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
            >
              <DatePicker
                showTime
                disabledDate={(date) => dayjs(date).add(1, "d").isBefore(dayjs())}
              />
            </Form.Item>

            <Form.Item
              label="Ngày kết thúc"
              style={{ width: 850 }}
              name="expirationDate"
              rules={[
                { required: true, message: "Vui lòng nhập ngày kết thúc!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("startDate") < value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Ngày kết thúc phải sau ngày bắt đầu!")
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                disabledDate={(date) => dayjs(date).add(1, "d").isBefore(dayjs())}
              />
            </Form.Item>
          </div>



          <Form.Item
            label="Số lượng"
            style={{ width: 850 }}
            name="quantity"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng mã giảm giá!" },
            ]}
          >
            <Input placeholder="Số lượng" type="number" />
          </Form.Item>



          <Form.Item
            label="Giá trị đơn hàng tối thiểu"
            style={{ width: 850 }}
            name="minPurchaseAmount"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị đơn hàng tối thiểu!",
              },
            ]}
          >
            <Input placeholder="Giá trị đơn hàng tối thiểu" type="number" />
          </Form.Item>


          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ float: "right", paddingRight: "25px", marginTop: "20px" }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default VoucherAddPage;