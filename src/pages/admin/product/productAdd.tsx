import { useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col, Upload, UploadFile, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadImage } from '../../../services/upload/upload';
import { FormProps } from 'antd/lib';
import { IProduct } from '../../../interface/Products';
import Category from '../category/Category';

const { Option } = Select;

const ProductAdd = () => {
  const [form] = Form.useForm();
  const [showSubForm, setShowSubForm] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [addedSizes, setAddedSizes] = useState<Record<string, string[]>>({}); // Track added sizes for each color
  const [addedColors, setAddedColors] = useState<string[]>([]);
  const categories = [
    { id: 1, name: 'áo mùa hè' },
    { id: 2, name: 'áo mùa đông' }
  ];

  const handleProductTypeClick = () => {
    setShowSubForm(!showSubForm);
  };

  const onFinish = async (values: any) => {
    const formattedData = {
      name: values.name,
      category: values.category,
      description: values.description,
      coverImage: values.coverImage[0], // nếu có trường ảnh bìa
      variants: values.variants?.map((variant: any) => ({
        color: variant.color,
        sizes: variant.sizes?.map((size: any) => ({
          nameSize: size.nameSize,
          price: size.price,
          inventory: size.inventory,
        })),
        images: variant.images.map((file) => file.originFileObj || file.url || file.thumbUrl), // Lấy URL ảnh từ các thuộc tính phù hợp
      })),
    };
    console.log("Formatted Data: ", formattedData);
  };

  // const onFinishFailed: FormProps<IProduct>['onFinishFailed'] = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  // const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
  //   setFileList(fileList);
  // };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateProductType = (value: any) => {
    if (showSubForm && (!value || value.length === 0)) {
      return Promise.reject(new Error('Vui lòng chọn ít nhất một loại sản phẩm!'));
    }
    return Promise.resolve();
  };
  // Hàm kiểm tra nếu size đã tồn tại cho màu đó
  const handleSizeCheck = (sizes: string[], currentSize: string) => {
    if (sizes.includes(currentSize)) {
      return true;
    }
    return false;
  };

  // Hàm thêm size vào danh sách addedSizes
  const addSizeForColor = (color: string, size: string) => {
    setAddedSizes((prev) => {
      const updatedSizes = { ...prev };
      if (!updatedSizes[color]) {
        updatedSizes[color] = [];
      }
      updatedSizes[color].push(size);
      return updatedSizes;
    });
  };
  // Hàm kiểm tra nếu màu đã tồn tại
  const handleColorCheck = (color: string) => {
    if (addedColors.includes(color)) {
      message.error('Màu này đã được thêm trước đó!');
      return false;
    }
    return true;
  };

  // Hàm thêm màu vào danh sách addedColors
  const addColor = (color: string) => {
    setAddedColors((prevColors) => [...prevColors, color]);
  };
  return (
    <Form
      layout="vertical"
      form={form}
      style={{ maxWidth: '800px', margin: '0 auto' }}
      onFinish={onFinish}
    // onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Danh mục"
        name="category"
        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
      >
        <Select placeholder="Chọn danh mục">
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Mô tả sản phẩm"
        name="description"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
      >
        <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Ảnh bìa"
        name="coverImage"
        valuePropName="file"
        getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
        rules={[{ required: true, message: 'Vui lòng tải lên ảnh bìa!' }]}
      >
        <Upload
          name="coverImage"
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

      <Form.Item label="Loại sản phẩm">
        <Button type="primary" onClick={handleProductTypeClick}>
          {showSubForm ? 'Ẩn loại sản phẩm' : 'Chọn loại sản phẩm'}
        </Button>
      </Form.Item>

      {showSubForm && (
        <Form.Item name="variants" rules={[{ validator: validateProductType }]}>
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: '1px solid #f0f0f0',
                      padding: '16px',
                      marginBottom: '24px',
                      borderRadius: '8px',
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'color']}
                          label="Nhập màu sắc"
                          rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
                        >
                          <Input placeholder="Nhập màu sắc" />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          {...restField}
                          name={[name, 'images']}  // Đảm bảo sử dụng name={[name, 'images']}
                          label="Ảnh bìa"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                          rules={[{ required: true, message: 'Vui lòng tải lên ảnh bìa!' }]}
                        >
                          <Upload
                            name="images"
                            listType="picture-card"
                            beforeUpload={() => false} // Để tránh tải lên tự động
                            maxCount={3}
                            multiple
                            accept=".jpg,.png,.jpeg"
                          >
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </div>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.List name={[name, 'sizes']}>
                      {(sizeFields, { add: addSize, remove: removeSize }) => (
                        <>
                          {sizeFields.map(({ key: sizeKey, name: sizeName, ...sizeRestField }) => (
                            <Row gutter={16} key={sizeKey} style={{ alignItems: 'center' }}>
                              <Col span={6}>
                                <Form.Item
                                  {...sizeRestField}
                                  name={[sizeName, 'nameSize']}
                                  label="Size"
                                  rules={[{ required: true, message: 'Chọn size' }]}
                                >
                                  <Select placeholder="Chọn size">
                                    <Option value="S">S</Option>
                                    <Option value="M">M</Option>
                                    <Option value="L">L</Option>
                                    <Option value="XL">XL</Option>
                                    <Option value="XXL">XXL</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...sizeRestField}
                                  name={[sizeName, 'price']}
                                  label="Giá"
                                  rules={[{ required: true, message: 'Nhập giá' }]}
                                >
                                  <InputNumber min={0} placeholder="Giá" style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...sizeRestField}
                                  name={[sizeName, 'inventory']}
                                  label="Số lượng"
                                  rules={[{ required: true, message: 'Nhập số lượng' }]}
                                >
                                  <InputNumber min={0} placeholder="Số lượng" style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                              <Col span={6} style={{ textAlign: 'right' }}>
                                <Button
                                  type="primary"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeSize(sizeName)}
                                >
                                  Xóa
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => addSize()}>
                              Thêm Size
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Col span={24}>
                      <Button type="primary" danger onClick={() => remove(name)}>
                        Xóa màu
                      </Button>
                    </Col>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()}>
                    Thêm màu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>

  );
};
export default ProductAdd;

