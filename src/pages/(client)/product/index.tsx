import { Col, Row, Select, Slider, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import { useProduct } from "../../../contexts/ProductContext";
import { useCategory } from "../../../contexts/CategoryContext";
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
  const [filteredProducts, setFilteredProducts] = useState(allProduct);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [popularColors, setPopularColors] = useState<string[]>([]); // Màu phổ biến
  const itemsPerPage = 8;

  // Lấy 5 màu phổ biến nhất
  useEffect(() => {
    const getPopularColors = () => {
      const colorCount: Record<string, number> = {};
      console.log(colorCount);

      allProduct.forEach((product) => {
        product.variants.forEach((variant) => {
          const color = variant.color;
          colorCount[color] = (colorCount[color] || 0) + 1;
        });
      });
      const sortedColors = Object.entries(colorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => color);

      setPopularColors(sortedColors);
    };

    getPopularColors();
  }, [allProduct]);

  // Fetch all categories on component mount
  useEffect(() => {
    setIsLoading(true);
    getAllDataCategory().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      getDataCategoryById(selectedCategory).finally(() => setIsLoading(false));
    } else {
      setFilteredProducts(allProduct); // Nếu không chọn danh mục, sử dụng tất cả sản phẩm
    }
  }, [selectedCategory, allProduct]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handlePriceChange = (value: number[]) =>
    setPriceRange([value[0], value[1]]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    localStorage.setItem("sortOption", value);
  };

  const applyFilters = () => {
    const filtered = (selectedCategory ? activeCategoryProducts : allProduct)
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

    if (JSON.stringify(filteredProducts) !== JSON.stringify(sorted)) {
      setFilteredProducts(sorted);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [
    priceRange,
    sortOption,
    selectedColor,
    selectedSize,
    activeCategoryProducts
  ]);

  const handlePageChange = (page: number) => setCurrentPage(page);

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
            <h3 className="text-lg font-bold mb-4">Bộ lọc</h3>

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
          {isLoading ? (
            <Spin tip="Đang tải sản phẩm..." className="w-full text-center" />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Sản phẩm</h3>
                <Select value={sortOption} onChange={handleSortChange}>
                  <Option value="featured">Sản phẩm nổi bật</Option>
                  <Option value="priceAsc">Giá tăng dần</Option>
                  <Option value="priceDesc">Giá giảm dần</Option>
                </Select>
              </div>

              <Row gutter={[16, 16]}>
                {paginatedProducts
                  .filter((item) => item.isActive === true)
                  .map((product) => (
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

              <div className="flex justify-center mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={filteredProducts.length}
                  onChange={handlePageChange}
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
