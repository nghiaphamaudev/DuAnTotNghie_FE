import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col, Upload, UploadFile, message, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllCategory } from '../../../services/categoryServices';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ProductAdd: React.FC = () => {
  const [form] = Form.useForm();
  const [showSubForm, setShowSubForm] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        console.log('Dữ liệu từ API:', response);
        if (response && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Dữ liệu danh mục không phải là mảng:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
        message.error('Không thể tải danh mục');
      }
    };

    fetchCategories();
  }, []);




  const handleProductTypeClick = () => {
    setShowSubForm(!showSubForm);
  };

  const onFinish = async (values: any) => {
    console.log('Received form values:', values);
    if (!values.discount || values.discount === 'undefined') {
      values.discount = 0;
    }
    if (values.status === undefined) {
      values.status = true;
    }

    // Tạo FormData object
    const formData = new FormData();
    setLoading(true);
    formData.append('name', values.name);
    formData.append('category', values.category);
    formData.append('description', values.description);
    formData.append('discount', values.discount.toString());
    formData.append('ratingAverage', '0');
    formData.append('ratingQuantity', '0');
    formData.append('status', values.status);

    if (values.coverImage && values.coverImage.length > 0) {
      formData.append('coverImage', values.coverImage[0].originFileObj);
    } else {
      message.error('Cover image is required.');
      return;
    }

    if (values.variants && values.variants.length > 0) {
      values.variants.forEach((variant: any, index: number) => {
        if (!variant.color || !variant.sizes || !variant.images || variant.images.length === 0) {
          message.error('Each variant must have a color, sizes, and images.');
          return;
        }

        formData.append(`variants[${index}][color]`, variant.color);
        variant.sizes.forEach((size: any, sizeIndex: number) => {
          formData.append(`variants[${index}][sizes][${sizeIndex}][nameSize]`, size.nameSize);
          formData.append(`variants[${index}][sizes][${sizeIndex}][price]`, size.price);
          formData.append(`variants[${index}][sizes][${sizeIndex}][inventory]`, size.inventory);
        });
        variant.images.forEach((image: any) => {
          formData.append(`variants[${index}][images]`, image.originFileObj);
        });
      });
    } else {
      message.error('At least one variant is required.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/products', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Sản phẩm đã được thêm thành công:', data);
        message.success('Thêm sản phẩm thành công!');


        form.resetFields();
        navigate('/admin/product')
        setFileList([]);
      } else {
        console.error('Lỗi khi thêm sản phẩm:', data);
        message.error(`Lỗi khi thêm sản phẩm: ${data.message || 'Có lỗi xảy ra'}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      message.error(`Lỗi khi thêm sản phẩm`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileListChange = (info: any) => {
    setFileList(info.fileList);
  };

  const validateUniqueColor = (_: any, value: string) => {
    const variants = form.getFieldValue('variants') || [];
    const colors = variants.map((variant: any) => variant?.color).filter(Boolean);
    if (colors.filter((color: string) => color === value).length > 1) {
      return Promise.reject(new Error('Màu sắc đã tồn tại! Vui lòng chọn màu khác.'));
    }
    return Promise.resolve();
  };

  const validateUniqueSize = (variantIndex: number) => (_: any, value: string) => {
    const variants = form.getFieldValue('variants') || [];
    const sizes = variants[variantIndex]?.sizes || [];
    const sizeNames = sizes.map((size: any) => size?.nameSize).filter(Boolean);
    if (sizeNames.filter((size: string) => size === value).length > 1) {
      return Promise.reject(new Error('Size này đã tồn tại trong biến thể! Vui lòng chọn size khác.'));
    }
    return Promise.resolve();
  };

  return (
    <Spin spinning={loading} tip="Đang xử lý...">
      <Form
        layout="vertical"
        form={form}
        style={{ maxWidth: '800px', margin: '0 auto' }}
        onFinish={onFinish}
        disabled={loading}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]} >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select>
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item
          label="Mô tả sản phẩm"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]} >
          <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Ảnh bìa"
          name="coverImage"
          valuePropName="file"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          rules={[{ required: true, message: 'Vui lòng tải lên ảnh bìa!' }]}>
          <Upload
            name="coverImage"
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            accept=".jpg,.png,.jpeg">
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

        {
          showSubForm && (
            <Form.Item name="variants">
              <Form.List name="variants">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ border: '1px solid #f0f0f0', padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
                        <Row gutter={16}>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'color']}
                              label="Màu sắc"
                              rules={[{ required: true, message: 'Nhập màu sắc' }, { validator: validateUniqueColor }]}>
                              <Input placeholder="Nhập màu sắc" />
                            </Form.Item>
                          </Col>
                          <Col span={18}>
                            <Form.Item
                              {...restField}
                              name={[name, 'images']}
                              label="Ảnh màu"
                              valuePropName="fileList"
                              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                              rules={[{ required: true, message: 'Vui lòng tải lên ảnh màu!' }]}>
                              <Upload
                                name="images"
                                listType="picture-card"
                                beforeUpload={() => false}
                                maxCount={3}
                                multiple
                                accept=".jpg,.png,.jpeg">
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
                                      rules={[
                                        { required: true, message: 'Chọn size' },
                                        { validator: validateUniqueSize(name) },
                                      ]}>
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
                                      rules={[{ required: true, message: 'Nhập giá' }]}>
                                      <InputNumber min={0} placeholder="Giá" style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item
                                      {...sizeRestField}
                                      name={[sizeName, 'inventory']}
                                      label="Số lượng"
                                      rules={[{ required: true, message: 'Nhập số lượng' }]}>
                                      <InputNumber min={0} placeholder="Số lượng" style={{ width: '100%' }} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={6} style={{ textAlign: 'right' }}>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => removeSize(sizeName)}
                                      type="link"
                                      danger
                                    />
                                  </Col>
                                </Row>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  icon={<PlusOutlined />}
                                  onClick={() => addSize()}
                                  block
                                >
                                  Thêm Size
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>

                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          type="link"
                          danger
                          style={{ marginBottom: '16px' }}
                        >
                          Xóa biến thể
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => add()}
                        block
                      >
                        Thêm Biến thể
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          )
        }

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm Sản Phẩm
          </Button>
        </Form.Item>
      </Form >

    </Spin>

  );
};

export default ProductAdd;
