/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Row,
  Col,
  Upload,
  UploadFile,
  message,
  Spin,
  Switch,
  Space
} from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  getProductById,
  toggleSizeStatus,
  toggleVariantStatus,
  updateProduct
} from "../../../services/productServices";
import { getAllCategory } from "../../../services/categoryServices";
import { Link, useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../socket";

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
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [isAddSize, setIsAddSize] = useState<{ [key: number]: boolean }>({});
  const [fields, setFields] = useState([]);

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const product = await getProductById(id);
      if (product) {
        setInitialData(product.data);
        const coverImageFileList = product.data.coverImg
          ? [
              {
                url: product.data.coverImg,
                name: "coverImage.jpg"
              }
            ]
          : [];
        form.setFieldsValue({
          name: product.data.name,
          category: product.data.category
            ? product.data.category.id
            : "Không có danh mục",
          description: product.data.description,
          discount: product.data.discount,
          coverImage: coverImageFileList,
          variants: product.data.variants.map((variant: any) => ({
            color: variant.color,
            status: variant.status,
            sizes: variant.sizes,
            images: variant.images.map((img: any) => ({ url: img }))
          }))
        });
        setFileList(coverImageFileList);
      } else {
        message.error("Không thể tải chi tiết sản phẩm");
      }
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();
      if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        message.error("Không thể tải danh mục");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh mục");
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
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("discount", values.discount?.toString() || "0");
    formData.append("ratingAverage", "0");
    formData.append("ratingQuantity", "0");
    formData.append("isActive", values.isActive);

    // Xử lý ảnh bìa
    if (values.coverImage && values.coverImage.length > 0) {
      formData.append("coverImage", values.coverImage[0].originFileObj);
    } else if (initialData?.coverImg) {
      formData.append("coverImage", initialData.coverImg);
    }

    // Xử lý biến thể
    if (values.variants && values.variants.length > 0) {
      values.variants.forEach((variant: any, index: number) => {
        formData.append(`variants[${index}][color]`, variant.color);
        formData.append(`variants[${index}][status]`, variant.status);

        // Xử lý sizes
        variant.sizes.forEach((size: any, sizeIndex: number) => {
          formData.append(
            `variants[${index}][sizes][${sizeIndex}][nameSize]`,
            size.nameSize
          );
          formData.append(
            `variants[${index}][sizes][${sizeIndex}][price]`,
            size.price.toString()
          );
          formData.append(
            `variants[${index}][sizes][${sizeIndex}][inventory]`,
            size.inventory.toString()
          );
          formData.append(
            `variants[${index}][sizes][${sizeIndex}][status]`,
            size.status
          );
        });

        // Xử lý ảnh
        const oldImages = initialData?.variants[index]?.images || []; // Ảnh cũ từ BE
        const newImageFiles =
          variant.images?.filter((img: any) => img.originFileObj) || []; // Ảnh mới
        const removedImages =
          initialData?.variants[index]?.images?.filter(
            (img: string) =>
              !variant.images.some((file: any) => file.url === img)
          ) || []; // Ảnh bị xóa

        // Gửi ảnh mới qua `imageFiles`
        newImageFiles.forEach((file: any) =>
          formData.append(`variants[${index}][imageFiles]`, file.originFileObj)
        );

        // Gửi danh sách ảnh cần xóa qua `imagesToDelete`
        removedImages.forEach(
          (image: string) => formData.append(`imagesToDelete`, image) // Thêm ảnh cần xóa vào mảng `imagesToDelete`
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
        message.success("Cập nhật sản phẩm thành công!");
        navigate("/admin/product");
      } else {
        message.error(
          `Cập nhật sản phẩm thất bại: ${
            response.message || "Lỗi không xác định"
          }`
        );
      }
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Handle file list change
  const handleFileListChange = (
    newFileList: UploadFile[],
    variantIndex: number
  ) => {
    const updatedVariants = [...variants];
    const currentVariant = updatedVariants[variantIndex];
    const oldImages =
      currentVariant?.images?.filter((img: any) => img.url) || [];
    const newImages = newFileList.filter((file) => file.originFileObj);
    const removedImages = oldImages.filter(
      (img: string) => !newFileList.some((file: any) => file.url === img)
    );
    setFileList([...newImages, ...oldImages]);
    updatedVariants[variantIndex] = {
      ...currentVariant,
      images: [...oldImages, ...newImages]
    };
    setVariants(updatedVariants);
    if (removedImages.length > 0) {
      const updatedRemovedImages = [...removedImages];
      setImagesToDelete(updatedRemovedImages);
    }
  };
  //validate màu
  const validateUniqueColor = (_: any, value: string) => {
    const variants = form.getFieldValue("variants") || [];
    // Chuẩn hóa màu sang chữ thường và lọc các giá trị hợp lệ
    const colors = variants
      .map((variant: any) => variant?.color?.toLowerCase())
      .filter(Boolean);
    // Kiểm tra trùng lặp không phân biệt chữ hoa chữ thường
    if (
      colors.filter((color: string) => color === value?.toLowerCase()).length >
      1
    ) {
      return Promise.reject(
        new Error("Màu sắc đã tồn tại! Vui lòng chọn màu khác.")
      );
    }
    return Promise.resolve();
  };
  // Validate for duplicate size
  // Hàm validate kiểm tra size có trùng lặp hay không trong cùng một biến thể
  const validateUniqueSize =
    (variantIndex: number) => (_: any, value: string) => {
      const variants = form.getFieldValue("variants") || [];
      const sizes = variants[variantIndex]?.sizes || [];
      const sizeNames = sizes
        .map((size: any) => size?.nameSize)
        .filter(Boolean);

      if (sizeNames.filter((size: string) => size === value).length > 1) {
        return Promise.reject(
          new Error(
            "Size này đã tồn tại trong biến thể! Vui lòng chọn size khác."
          )
        );
      }

      return Promise.resolve();
    };

  const handleStatusChange = (
    productId: string,
    variantIndex: number,
    currentStatus: any
  ) => {
    if (!initialData || !Array.isArray(initialData.variants)) {
      console.error("Initial Data hoặc variants không hợp lệ:", initialData);
      message.error("Dữ liệu sản phẩm chưa sẵn sàng hoặc không hợp lệ.");
      return;
    }

    const variant = initialData.variants[variantIndex];
    if (!variant || !variant.id) {
      console.error("Không tìm thấy biến thể tại index:", variantIndex);
      return;
    }

    const newStatus = currentStatus ? false : true;
    const variantId = variant.id; // Sử dụng `id` thay vì `_id`
    toggleVariantStatus(productId, variantId, newStatus)
      .then(() => {
        socket.emit("hidden product", id);
        message.success("Cập nhật trạng thái thành công!");
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        message.error("Cập nhật trạng thái thất bại.");
      });
  };

  const handleSizeStatusChange = (
    productId: string,
    variantIndex: number,
    sizeIndex: number,
    currentStatus: boolean
  ) => {
    if (!initialData || !Array.isArray(initialData.variants)) {
      console.error("Initial Data hoặc variants không hợp lệ:", initialData);
      message.error("Dữ liệu sản phẩm chưa sẵn sàng hoặc không hợp lệ.");
      return;
    }

    const variant = initialData.variants[variantIndex];
    if (!variant || !Array.isArray(variant.sizes)) {
      console.error(
        "Không tìm thấy biến thể hoặc kích thước tại index:",
        variantIndex
      );
      return;
    }

    const size = variant.sizes[sizeIndex];
    if (!size || !size.id) {
      console.error("Không tìm thấy kích thước tại index:", sizeIndex);
      return;
    }

    const newStatus = !currentStatus; // Đổi trạng thái
    const sizeId = size.id; // Sử dụng `id` thay vì `_id`

    // Gọi API cập nhật trạng thái size
    toggleSizeStatus(productId, variant.id, sizeId, newStatus)
      .then(() => {
        socket.emit("hidden product", id);
        message.success("Cập nhật trạng thái kích thước thành công!");
        // Cập nhật trạng thái size trên giao diện (nếu cần)
        initialData.variants[variantIndex].sizes[sizeIndex].status = newStatus;
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật trạng thái kích thước:", err);
        message.error("Cập nhật trạng thái kích thước thất bại.");
      });
  };

  const handleAddVariant = () => {
    setIsAddingVariant(true);
    setFields([...fields, {}]);
  };
  const handleCancelAddVariant = () => {
    setIsAddingVariant(false); // Đánh dấu không còn thêm biến thể mới
    const variants = form.getFieldValue("variants");
    variants.pop(); // Xóa biến thể mới khỏi mảng
    form.setFieldsValue({ variants }); // Cập nhật lại giá trị form
  };

  const handleAddSize = (variantIndex: number, addSize: () => void) => {
    addSize(); // Thêm size mới vào form
    setIsAddSize((prev) => ({
      ...prev,
      [variantIndex]: true // Đánh dấu trạng thái là đang thêm size cho biến thể này
    }));
  };

  const handleCancelAddSize = (
    variantIndex: number,
    removeSize: () => void
  ) => {
    // Xóa size mới vừa thêm
    removeSize();
    setIsAddSize((prev) => {
      const updated = { ...prev };
      delete updated[variantIndex]; // Xóa trạng thái của biến thể khỏi isAddSize
      return updated;
    });

    // Xóa cả form size mới thêm khỏi biến thể
    const variants = form.getFieldValue("variants");
    variants[variantIndex].sizes.pop(); // Xóa size mới ở biến thể này
    form.setFieldsValue({ variants }); // Cập nhật lại giá trị form
  };

  return (
    <Spin spinning={loading} tip="Đang xử lý...">
      <Form
        layout="vertical"
        form={form}
        style={{ maxWidth: "800px", margin: "0 auto" }}
        onFinish={onFinish}
        initialValues={initialData}
        disabled={loading}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
            {
              pattern:
                /^(?!.*^(?:\p{L}+|\p{N}+)$)[\p{L}\p{N}\s\p{P}\p{S}]{6,}$/u,
              message: "Tên sản phẩm phải có ít nhất 6 ký "
            }
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: "Vui lòng nhập danh mục!" }]}
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
          rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
        >
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
            {showSubForm ? "Ẩn loại sản phẩm" : "Chọn loại sản phẩm"}
          </Button>
        </Form.Item>

        {showSubForm && (
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(
                  ({ key, name, fieldKey, ...restField }, variantIndex) => (
                    <div
                      key={key}
                      style={{
                        border: "1px solid #f0f0f0",
                        padding: "16px",
                        marginBottom: "24px",
                        borderRadius: "8px"
                      }}
                    >
                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "color"]}
                            label="Màu sắc"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập màu sắc"
                              },
                              { validator: validateUniqueColor },
                              {
                                pattern:
                                  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯăạảãầấậẩẫằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ ]+$/,
                                message:
                                  "Không được nhập số hoặc kí tự đặc biệt"
                              }
                            ]}
                          >
                            <Input placeholder="Nhập màu sắc" />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "status"]}
                            label="Trạng thái"
                          >
                            <Switch
                              checked={restField.value?.status}
                              onChange={async (checked: boolean) => {
                                setLoading(true);
                                const currentStatus = checked;
                                const productId = id;
                                handleStatusChange(
                                  productId,
                                  name,
                                  currentStatus
                                ); // Gửi variantIndex
                                setLoading(false);
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={18}>
                          <Form.Item
                            {...restField}
                            name={[name, "images"]}
                            label="Ảnh màu"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                              Array.isArray(e) ? e : e?.fileList
                            }
                          >
                            <Upload
                              name="images"
                              listType="picture-card"
                              beforeUpload={() => false} // Không upload ngay lập tức
                              onChange={({ fileList: newFileList }) =>
                                handleFileListChange(newFileList, name)
                              } // Sử dụng đúng index biến thể
                              maxCount={4}
                              multiple
                              accept=".jpg,.png,.jpeg"
                              defaultFileList={
                                initialData?.variants[name]?.images?.map(
                                  (url: string, idx: number) => ({
                                    uid: `${url}-${idx}`, // Tạo UID để không trùng
                                    name: `image-${idx}.jpg`,
                                    status: "done",
                                    url
                                  })
                                ) || []
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

                      <Form.List name={[name, "sizes"]}>
                        {(sizeFields, { add: addSize, remove: removeSize }) => (
                          <>
                            {sizeFields.map(
                              (
                                {
                                  key: sizeKey,
                                  name: sizeName,
                                  ...sizeRestField
                                },
                                sizeIndex
                              ) => (
                                <Row
                                  gutter={16}
                                  key={sizeKey}
                                  style={{ alignItems: "center" }}
                                >
                                  <Col span={6}>
                                    <Form.Item
                                      {...sizeRestField}
                                      name={[sizeName, "nameSize"]}
                                      label="Size"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Chọn size"
                                        },
                                        { validator: validateUniqueSize(name) }
                                      ]}
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
                                      name={[sizeName, "price"]}
                                      label="Giá"
                                      rules={[
                                        {
                                          type: "number",
                                          min: 1,
                                          message: "Giá phải lớn hơn 0"
                                        },
                                        {
                                          required: true,
                                          message:
                                            "Giá sản phẩm không được để trống"
                                        }
                                      ]}
                                    >
                                      <InputNumber
                                        placeholder="Giá"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={6}>
                                    <Form.Item
                                      {...sizeRestField}
                                      name={[sizeName, "inventory"]}
                                      label="Số lượng"
                                      rules={[
                                        { type: "number", min: 0 },
                                        {
                                          required: true,
                                          message:
                                            "Số lượng không được để trống"
                                        }
                                      ]}
                                    >
                                      <InputNumber
                                        placeholder="Số lượng"
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>

                                  <Col span={6}>
                                    <Form.Item
                                      {...sizeRestField}
                                      name={[sizeName, "status"]}
                                      label="Trạng thái"
                                      valuePropName="checked"
                                    >
                                      <Switch
                                        checked={sizeRestField?.status}
                                        onChange={async (checked: boolean) => {
                                          setLoading(true);
                                          const currentStatus = checked;
                                          const productId = id;
                                          handleSizeStatusChange(
                                            productId,
                                            variantIndex,
                                            sizeIndex,
                                            currentStatus
                                          );
                                          setLoading(false);
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  {sizeIndex === sizeFields.length - 1 &&
                                    !sizeRestField?.nameSize &&
                                    isAddSize[variantIndex] && (
                                      <Form.Item>
                                        <Button
                                          type="link"
                                          onClick={() =>
                                            handleCancelAddSize(
                                              variantIndex,
                                              removeSize
                                            )
                                          }
                                          icon={<MinusCircleOutlined />}
                                        >
                                          Bỏ thêm Size
                                        </Button>
                                      </Form.Item>
                                    )}
                                </Row>
                              )
                            )}
                            <Form.Item>
                              <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                  handleAddSize(variantIndex, addSize)
                                }
                                block
                              >
                                Thêm Size
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                      {isAddingVariant &&
                        variantIndex === fields.length - 1 && (
                          <Form.Item>
                            <Button
                              type="link"
                              onClick={handleCancelAddVariant}
                              icon={<MinusCircleOutlined />}
                            >
                              Bỏ thêm
                            </Button>
                          </Form.Item>
                        )}
                    </div>
                  )
                )}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      handleAddVariant();
                      add();
                    }}
                    icon={<PlusOutlined />}
                  >
                    Thêm biến thể sản phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Cập nhật sản phẩm
            </Button>
            <Button type="default" htmlType="button" block>
              <Link to={`/admin/product`}>Thoát</Link>
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default ProductEdit;
