import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col, Upload, UploadFile, message, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getProductById, updateProduct } from '../../../services/productServices';
import { getAllCategory } from '../../../services/categoryServices';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const ProductEdit: React.FC = () => {
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [showSubForm, setShowSubForm] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const { id } = useParams<{ id: string | undefined }>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const product = await getProductById(id);
      if (product) {
        setInitialData(product.data);
        const coverImageFileList = product.data.coverImg ? [{
          url: product.data.coverImg,
          name: 'coverImage.jpg'
        }] : [];
        form.setFieldsValue({
          name: product.data.name,
          category: product.data.category ? product.data.category.id : 'Không có danh mục',
          description: product.data.description,
          discount: product.data.discount,
          status: product.data.status,
          coverImage: coverImageFileList,
          variants: product.data.variants.map((variant: any) => ({
            color: variant.color,
            sizes: variant.sizes,
            images: variant.images.map((img: any) => ({ url: img }))
          }))
        });
        setFileList(coverImageFileList);
      } else {
        message.error('Không thể tải chi tiết sản phẩm');
      }
    } catch (error) {
      message.error('Lỗi khi tải sản phẩm');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();
      if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        message.error('Không thể tải danh mục');
      }
    } catch (error) {
      message.error('Lỗi khi tải danh mục');
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchCategories();
  }, [id]);

  const handleProductTypeClick = () => {
    setShowSubForm(!showSubForm);
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    const formData = new FormData();
    setLoading(true);
    formData.append('name', values.name);
    formData.append('category', values.category);
    formData.append('description', values.description);
    formData.append('discount', values.discount?.toString() || '0');
    formData.append('ratingAverage', '0');
    formData.append('ratingQuantity', '0');
    formData.append('isActive', values.isActive);

    // Xử lý ảnh bìa
    if (values.coverImage && values.coverImage.length > 0) {
      formData.append('coverImage', values.coverImage[0].originFileObj);
    } else if (initialData?.coverImg) {
      formData.append('coverImage', initialData.coverImg);
    }

    // Xử lý biến thể
    if (values.variants && values.variants.length > 0) {
      values.variants.forEach((variant: any, index: number) => {
        formData.append(`variants[${index}][color]`, variant.color);

        // Xử lý sizes
        variant.sizes.forEach((size: any, sizeIndex: number) => {
          formData.append(`variants[${index}][sizes][${sizeIndex}][nameSize]`, size.nameSize);
          formData.append(`variants[${index}][sizes][${sizeIndex}][price]`, size.price.toString());
          formData.append(`variants[${index}][sizes][${sizeIndex}][inventory]`, size.inventory.toString());
        });

        // Xử lý ảnh
        const oldImages = initialData?.variants[index]?.images || []; // Ảnh cũ từ BE
        const newImageFiles = variant.images?.filter((img: any) => img.originFileObj) || []; // Ảnh mới
        const removedImages = initialData?.variants[index]?.images?.filter(
          (img: string) => !variant.images.some((file: any) => file.url === img)
        ) || []; // Ảnh bị xóa

        // Gửi ảnh mới qua `imageFiles`
        newImageFiles.forEach((file: any) =>
          formData.append(`variants[${index}][imageFiles]`, file.originFileObj)
        );

        // Gửi danh sách ảnh cần xóa qua `imagesToDelete`
        removedImages.forEach((image: string) =>
          formData.append(`imagesToDelete`, image)  // Thêm ảnh cần xóa vào mảng `imagesToDelete`
        );

        // Nếu không có ảnh mới và không có ảnh xóa, gửi ảnh cũ
        if (newImageFiles.length === 0 && removedImages.length === 0) {
          oldImages.forEach((image: string) =>
            formData.append(`variants[${index}][images]`, image)
          );
        }
      });
    }

    try {
      const response = await updateProduct(id, formData);
      if (response.status) {
        message.success('Cập nhật sản phẩm thành công!');
        navigate('/admin/product');
      } else {
        message.error(`Cập nhật sản phẩm thất bại: ${response.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      message.error('Lỗi khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };







  // Handle file list change
  const handleFileListChange = (newFileList: UploadFile[], variantIndex: number) => {
    const updatedVariants = [...variants];
    const currentVariant = updatedVariants[variantIndex];
    const oldImages = currentVariant?.images?.filter((img: any) => img.url) || [];
    const newImages = newFileList.filter((file) => file.originFileObj);
    const removedImages = oldImages.filter(
      (img: string) => !newFileList.some((file: any) => file.url === img)
    );
    setFileList([...newImages, ...oldImages]);
    updatedVariants[variantIndex] = {
      ...currentVariant,
      images: [...oldImages, ...newImages],
    };
    setVariants(updatedVariants);
    if (removedImages.length > 0) {
      const updatedRemovedImages = [...removedImages];
      setImagesToDelete(updatedRemovedImages);
    }
  };






  // Validate for duplicate color
  const validateUniqueColor = (_: any, value: string) => {
    const variants = form.getFieldValue('variants') || [];
    const colors = variants.map((variant: any) => variant?.color).filter(Boolean);
    if (colors.filter((color: string) => color === value).length > 1) {
      return Promise.reject(new Error('Màu sắc đã tồn tại! Vui lòng chọn màu khác.'));
    }
    return Promise.resolve();
  };

  // Validate for duplicate size
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
        initialValues={initialData}
        disabled={loading}
      >
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select placeholder="Chọn danh mục">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Mô tả sản phẩm" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
          <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Ảnh bìa"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => e && e.fileList}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            {fileList.length >= 1 ? null : <div>Upload</div>}
          </Upload>
        </Form.Item>

        <Form.Item label="Loại sản phẩm">
          <Button type="primary" onClick={handleProductTypeClick}>
            {showSubForm ? 'Ẩn loại sản phẩm' : 'Chọn loại sản phẩm'}
          </Button>
        </Form.Item>

        {showSubForm && (
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} style={{ border: '1px solid #f0f0f0', padding: '16px', marginBottom: '24px', borderRadius: '8px' }}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'color']}
                          label="Màu sắc"
                          rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }, { validator: validateUniqueColor }]}
                        >
                          <Input placeholder="Nhập màu sắc" />
                        </Form.Item>
                      </Col>

                      <Col span={18}>
                        <Form.Item
                          {...restField}
                          name={[name, 'images']}
                          label="Ảnh màu"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                        >
                          <Upload
                            name="images"
                            listType="picture-card"
                            beforeUpload={() => false} // Không upload ngay lập tức
                            onChange={({ fileList: newFileList }) => handleFileListChange(newFileList, name)} // Sử dụng đúng index biến thể
                            maxCount={4}
                            multiple
                            accept=".jpg,.png,.jpeg"
                            defaultFileList={
                              initialData?.variants[name]?.images?.map((url: string, idx: number) => ({
                                uid: `${url}-${idx}`, // Tạo UID để không trùng
                                name: `image-${idx}.jpg`,
                                status: 'done',
                                url,
                              })) || []
                            }
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
                                  rules={[{ required: true, message: 'Chọn size' }, { validator: validateUniqueSize(name) }]}
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

                    <Button onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Xóa biến thể
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm biến thể sản phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>



        )}

        <Form.Item>
          <Button type="primary" htmlType="submit"  >
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>

    </Spin>

  );
};

export default ProductEdit; 