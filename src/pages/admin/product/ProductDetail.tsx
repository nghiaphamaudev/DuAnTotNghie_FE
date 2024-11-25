import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  message,
  Spin,
  Card,
  Row,
  Col,
  Tag,
  Rate,
  Divider,
  Typography,
  Carousel,
  Image
} from "antd";
import { getProductById } from "../../../services/productServices";

const { Title, Text } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        console.log("RESPONSE:", response.data);
        if (response && response.data) {
          setProduct(response.data);
        } else {
          message.error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        message.error("Lỗi khi tải chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);
  console.log("PRODUCT DETAIL:", product);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  if (!product) {
    return <div>Không có thông tin sản phẩm.</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Card
        title={
          <Title level={1} style={{ textAlign: "center" }}>
            {product.name}
          </Title>
        }
        bordered={false}
        style={{ marginBottom: "40px" }}
      >
        <Row gutter={16} style={{ marginTop: "20px" }}>
          <Col span={8} style={{ display: "flex", justifyContent: "center" }}>
            <img
              alt={product.name || "Product"}
              src={product.coverImg || "default-image-url.jpg"} // Đặt URL ảnh mặc định nếu coverImg không tồn tại
              style={{ height: "300px", width: "300px", objectFit: "cover" }}
            />
          </Col>

          <Col
            span={16}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start"
            }}
          >
            <Text style={{ fontSize: "18px", lineHeight: "1.6" }}>
              {product.description || "Không có mô tả"}
            </Text>

            <div style={{ marginTop: "20px" }}>
              <h3>Danh mục:</h3>
              <Tag color="blue" style={{ fontSize: "16px" }}>
                {product.category?.name || "Không có danh mục"}
              </Tag>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3>Giảm giá:</h3>
              <Tag color="green" style={{ fontSize: "16px" }}>
                {product.discount || 0}%
              </Tag>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3>Đánh giá:</h3>
              <Rate allowHalf disabled value={product.ratingAverage || 0} />
              <Text>{product.ratingQuantity || 0} lượt đánh giá</Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Divider />

      <h2 style={{ textAlign: "center" }}>Biến thể sản phẩm</h2>
      <Row gutter={[24, 24]} justify="center">
        {product.variants?.map((variant: any, index: number) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{
                width: "100%",
                borderRadius: "10px",
                border: "1px solid #ddd"
              }}
            >
              <Card.Meta
                title={`Màu sắc: ${variant.color || "Không có màu sắc"}`}
                description={
                  <div>
                    {variant.sizes?.map((size: any, sizeIndex: number) => (
                      <Text
                        key={sizeIndex}
                        style={{ display: "block", marginBottom: "8px" }}
                      >
                        {size.nameSize || "Không có kích thước"} - Giá:{" "}
                        {size.price || 0} - Số lượng: {size.inventory || 0}
                      </Text>
                    ))}
                  </div>
                }
              />
              <div style={{ marginTop: "10px" }}>
                <Carousel autoplay dots={false}>
                  {variant.images?.map((image: string, imgIndex: number) => (
                    <div key={imgIndex}>
                      <Image
                        src={image}
                        alt={`variant-image-${imgIndex}`}
                        width="100%"
                        height={200}
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                      />
                    </div>
                  )) || <div>Không có hình ảnh</div>}
                </Carousel>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductDetail;
