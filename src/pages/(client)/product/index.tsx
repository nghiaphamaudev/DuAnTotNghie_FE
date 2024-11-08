import { Col, Row, Select, Slider, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useProduct } from "../../../contexts/ProductContext";
import ProductCard from "../../../components/common/(client)/ProductCard";

const { Option } = Select;

const ProductPage = () => {
  const { allProduct, getAllDataProduct } = useProduct();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
  const [sortOption, setSortOption] = useState<string>(
    localStorage.getItem("sortOption") || "featured"
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(allProduct);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Define how many items per page

  useEffect(() => {
    getAllDataProduct();
  }, [getAllDataProduct]);

  useEffect(() => {
    setFilteredProducts(allProduct);
  }, [allProduct]);

  const handlePriceChange = (value: number[]) =>
    setPriceRange([value[0], value[1]]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    localStorage.setItem("sortOption", value); // Save to localStorage
  };

  const applyFilters = () => {
    const filtered = allProduct
      .filter(
        (product) =>
          product.variants[0].sizes[0].price >= priceRange[0] &&
          product.variants[0].sizes[0].price <= priceRange[1]
      )
      .filter(
        (product) =>
          !selectedColor ||
          product.variants.some((variant) => variant.color === selectedColor)
      )
      .filter(
        (product) =>
          !selectedSize ||
          product.variants[0].sizes.some(
            (size) => size.nameSize === selectedSize
          )
      );

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "priceAsc") {
        return a.variants[0].sizes[0].price - b.variants[0].sizes[0].price;
      } else if (sortOption === "priceDesc") {
        return b.variants[0].sizes[0].price - a.variants[0].sizes[0].price;
      }
      return 0;
    });

    setFilteredProducts(sorted);
  };

  useEffect(() => {
    if (allProduct.length > 0) {
      applyFilters();
    }
  }, [priceRange, sortOption, selectedColor, selectedSize, allProduct]);

  // Handle page change
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Paginate filtered products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="px-4 py-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <div className="border p-4 rounded-md">
            {/* Filter options */}
            <h3 className="text-lg font-bold mb-4">Bộ lọc</h3>
            <h4 className="text-md font-semibold mb-2">Danh mục sản phẩm</h4>
            <ul className="space-y-2">
              <li>Áo nam</li>
              <li>Quần nam</li>
              <li>Bộ sưu tập</li>
            </ul>

            <h4 className="text-md font-semibold mt-4 mb-2">Khoảng giá</h4>
            <Slider
              range
              max={3000000}
              step={100000}
              value={priceRange}
              onChange={handlePriceChange}
              tooltip={{
                formatter: (value) => `${(value ?? 0).toLocaleString()}đ`
              }}
            />

            <h4 className="text-md font-semibold mt-4 mb-2">Màu sắc</h4>
            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {["black", "red", "teal", "yellow", "blue"].map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    selectedColor === color ? "border-2 border-blue-500" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                ></div>
              ))}
            </div>

            <h4 className="text-md font-semibold mt-4 mb-2">Size</h4>
            <div className="flex justify-start flex-wrap items-start gap-2">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <span
                  key={size}
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    selectedSize === size ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? null : size)
                  }
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} md={18}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Sản phẩm mới</h3>
            <Select value={sortOption} onChange={handleSortChange}>
              <Option value="featured">Sản phẩm nổi bật</Option>
              <Option value="priceAsc">Giá tăng dần</Option>
              <Option value="priceDesc">Giá giảm dần</Option>
            </Select>
          </div>

          <Row gutter={[16, 16]}>
            {paginatedProducts.map((product) => (
              <Col
                key={product.id}
                xs={24}
                sm={12}
                md={12}
                lg={6}
                className="flex justify-center items-center"
              >
                <ProductCard item={product} />
              </Col>
            ))}
          </Row>

          {/* Pagination Control */}
          <div className="flex justify-center my-6">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredProducts.length}
              onChange={handlePageChange}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
