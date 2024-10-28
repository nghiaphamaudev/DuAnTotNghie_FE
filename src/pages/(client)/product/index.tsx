import { Col, Row, Select, Slider } from "antd";
import { useState } from "react";
import ProductCard from "../../../components/common/(client)/ProductCard";

const { Option } = Select;

const ProductPage = () => {
  const [priceRange, setPriceRange] = useState([0, 3000000]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className="px-4 py-6">
      {/* Bộ lọc */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-bold mb-4">Bộ lọc</h3>

            {/* Danh mục sản phẩm */}
            <h4 className="text-md font-semibold mb-2">Danh mục sản phẩm</h4>
            <ul className="space-y-2">
              <li>Áo nam</li>
              <li>Quần nam</li>
              <li>Bộ sưu tập</li>
            </ul>

            {/* Khoảng giá */}
            <h4 className="text-md font-semibold mt-4 mb-2">Khoảng giá</h4>
            <Slider
              range
              max={3000000}
              step={100000}
              value={priceRange}
              onChange={handlePriceChange}
              tipFormatter={(value) => `${(value ?? 0).toLocaleString()}đ`}
            />

            {/* Màu sắc */}
            <h4 className="text-md font-semibold mt-4 mb-2">Màu sắc</h4>
            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="w-6 h-6 bg-black rounded-full"></div>
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <div className="w-6 h-6 bg-teal-500 rounded-full"></div>
              <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>

            {/* Size */}
            <h4 className="text-md font-semibold mt-4 mb-2">Size</h4>
            <div className="flex justify-start flex-wrap items-start gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <span key={size} className="px-3 py-1 border rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>
        </Col>

        {/* Sản phẩm */}
        <Col xs={24} md={18}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Sản phẩm mới</h3>
            <Select defaultValue="Sản phẩm nổi bật">
              <Option value="featured">Sản phẩm nổi bật</Option>
              <Option value="priceAsc">Giá tăng dần</Option>
              <Option value="priceDesc">Giá giảm dần</Option>
            </Select>
          </div>

          {/* Product grid */}
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5, 6].map((product) => (
              <Col
                key={product}
                xs={24} // 2 sản phẩm trên màn hình nhỏ
                sm={12} // 3 sản phẩm trên màn hình vừa
                md={12} // 4 sản phẩm trên màn hình lớn
                lg={6} // 5 sản phẩm trên màn hình rất lớn
                className="flex justify-center items-center flex-wrap"
              >
                <ProductCard />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
