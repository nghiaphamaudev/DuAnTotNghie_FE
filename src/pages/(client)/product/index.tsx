import { Col, Row, Select, Slider, Pagination, Spin } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useProduct } from "../../../contexts/ProductContext";
import { useCategory } from "../../../contexts/CategoryContext";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/common/(client)/ProductCard";

const { Option } = Select;

const ProductPage = () => {
  const { allProduct } = useProduct();
  const {
    allCategory,
    activeCategoryProducts,
    getAllDataCategory,
    getDataCategoryById
  } = useCategory();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
  const [sortOption, setSortOption] = useState<string>(
    localStorage.getItem("sortOption") || "featured"
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const itemsPerPage = 8;

  // Fetch categories on component mount
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      getDataCategoryById(selectedCategory).finally(() => setIsLoading(false));
    }
  }, [selectedCategory]);
  // Get category ID from URL query parameters
  useEffect(() => {
    const categoryId = searchParams.get("category");
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [searchParams]);

  // Fetch products by category

  // Popular colors calculation
  const popularColors = useMemo(() => {
    const colorCount: Record<string, number> = {};
    allProduct.forEach((product) =>
      product.variants.forEach((variant) => {
        const color = variant.color;
        colorCount[color] = (colorCount[color] || 0) + 1;
      })
    );

    return Object.entries(colorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
  }, [allProduct]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    const sourceProducts = selectedCategory
      ? activeCategoryProducts
      : allProduct;

    return sourceProducts
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
      )
      .sort((a, b) => {
        if (sortOption === "priceAsc") {
          return a.variants[0].sizes[0].price - b.variants[0].sizes[0].price;
        } else if (sortOption === "priceDesc") {
          return b.variants[0].sizes[0].price - a.variants[0].sizes[0].price;
        }
        return 0;
      });
  }, [
    allProduct,
    activeCategoryProducts,
    priceRange,
    selectedColor,
    selectedSize,
    sortOption,
    selectedCategory
  ]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProducts]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedColor(null);
    setSelectedSize(null);
    setPriceRange([0, 3000000]);
    setCurrentPage(1); // Reset pagination
  };

  return (
    <div className="px-4 py-6">
      <Row gutter={[16, 16]}>
        {/* Sidebar Filters */}
        <Col xs={24} md={6}>
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-bold mb-4">Bộ lọc</h3>

            {/* Categories */}
            <h4 className="text-md font-semibold mb-2">Danh mục sản phẩm</h4>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer ${
                  selectedCategory === null ? "text-blue-500" : ""
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                Tất cả sản phẩm
              </li>
              {allCategory.map((category) => (
                <li
                  key={category.id}
                  className={`cursor-pointer ${
                    selectedCategory === category.id ? "text-blue-500" : ""
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>

            {/* Price Range */}
            <h4 className="text-md font-semibold mt-4 mb-2">Khoảng giá</h4>
            <Slider
              range
              max={3000000}
              step={100000}
              value={priceRange}
              onChange={(value) => setPriceRange([value[0], value[1]])}
              tooltip={{
                formatter: (value) => `${(value ?? 0).toLocaleString()}đ`
              }}
            />

            {/* Colors */}
            <h4 className="text-md font-semibold mt-4 mb-2">Màu sắc</h4>
            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {popularColors.map((color) => (
                <div
                  key={color}
                  className={`cursor-pointer flex items-center justify-center border ${
                    selectedColor === color
                      ? "w-10 h-10 px-5 py-2 text-sm font-normal rounded-md bg-blue-500 text-white"
                      : "w-10 h-10 px-5 py-2 text-sm font-semibold rounded-md bg-white text-black"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                >
                  <span className="text-xs">{color}</span>
                </div>
              ))}
            </div>

            {/* Sizes */}
            <h4 className="text-md font-semibold mt-4 mb-2">Size</h4>
            <div className="flex gap-2">
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

        {/* Products Section */}
        <Col xs={24} md={18}>
          {isLoading ? (
            <Spin tip="Đang tải sản phẩm..." className="w-full text-center" />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Sản phẩm</h3>
                <Select
                  value={sortOption}
                  onChange={(value) => setSortOption(value)}
                >
                  <Option value="featured">Sản phẩm nổi bật</Option>
                  <Option value="priceAsc">Giá tăng dần</Option>
                  <Option value="priceDesc">Giá giảm dần</Option>
                </Select>
              </div>

              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product) => (
                  <Col key={product.id} xs={24} sm={12} lg={6}>
                    <ProductCard item={product} />
                  </Col>
                ))}
              </Row>

              <div className="flex justify-center mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={filteredProducts.length}
                  onChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
