import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleFilled
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Pagination,
  Radio,
  Row,
  Switch,
  Table
} from "antd";
import { ColumnType } from "antd/es/table";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Products, ProductVariant } from "../../../common/types/Product";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { getCategoryById } from "../../../services/categoryServices";
import { deleteProductStatus } from "../../../services/productServices";

const customTableHeaderCellStyle: React.CSSProperties = {
  fontWeight: "bold",
  textAlign: "center",
  height: "10px"
};

const CustomHeaderCell: React.FC<React.ComponentProps<"th">> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Products[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const [statusFilter, setStatusFilter] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [dataSource, setDataSource] = useState<Products[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hàm lấy dữ liệu danh mục và sản phẩm theo ID danh mục
  const fetchCategoryData = async () => {
    try {
      const response = await getCategoryById(id!);
      if (response) {
        setCategory(response.category);
        setProducts(response.products); // Set danh sách sản phẩm
        setPagination({
          current: 1,
          pageSize: 5,
          total: response.products.length
        });
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [id]);

  const handleSearch = debounce((value: string) => {
    setSearchValue(value);
  }, 500);

  const handleStatusChange = async (checked: boolean, id: string) => {
    try {
      // Call your API to update status here
      const productData = await deleteProductStatus(id, checked);
      if (productData && productData.data) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productData.data.id
              ? { ...product, isActive: productData.data.isActive }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleStatusFilterChange = (e: any) => {
    setStatusFilter(e.target.value);
  };



  const filteredData = products
    .filter((product) => {
      // Lọc theo trạng thái
      if (statusFilter === 2) return product.isActive === true;
      if (statusFilter === 3) return product.isActive === false;
      return true;
    })
    .filter((product) =>
      // Lọc theo từ khóa tìm kiếm
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    );





  const columns: ColumnType<Products>[] = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) => index + 1
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "20%",
      align: "center"
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "coverImg",
      render: (coverImg) => (
        <img src={coverImg} alt="Cover" style={{ width: 100, height: 100 }} />
      )
    },
    {
      title: "Số lượng",
      dataIndex: "variants",
      key: "quantity",
      width: "10%",
      align: "center",
      render: (variants: ProductVariant[]) => {
        const totalQuantity = variants.reduce((total, variant) => {
          return (
            total + variant.sizes.reduce((sum, size) => sum + size.inventory, 0)
          );
        }, 0);
        return totalQuantity;
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      width: "10%",
      render: (isActive, record) => (
        <Switch
          checked={isActive === true}
          checkedChildren=""
          unCheckedChildren=""
          onChange={(checked) => handleStatusChange(checked, record.id)}
        />
      )
    },
    {
      title: "Chi tiết",
      align: "center",
      dataIndex: "key",
      key: "key",
      width: "20%",
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Link to={`/admin/product/${record.id}`}>
            <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </Link>
          <Link to={`/admin/product/detail/${record.id}`}>
            <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          </Link>
        </div>
      )
    }
  ];

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm");
    XLSX.writeFile(wb, "products.xlsx");
  };

  return (
    <div>
      <BreadcrumbsCustom
        listLink={[]}
        nameHere={`Danh mục: ${category?.name || "Loading..."}`}
      />
      <Card bordered={false}>
        <h2>{category?.name}</h2>
        <p>{category?.description}</p>

        <Row gutter={16}>
          <Col span={12}>
            <Input.Search
              placeholder="Nhập tên sản phẩm"
              allowClear
              enterButton="Tìm kiếm"
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col span={12}>
            <Button
              icon={<DownloadOutlined />}
              style={{
                float: "right",
                marginLeft: "12px",
                backgroundColor: "white",
                color: "green",
                borderColor: "green"
              }}
              type="default"
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              style={{ float: "right" }}
            >
              <Link to={`/admin/product/add`}>Tạo sản phẩm</Link>
            </Button>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={12}>
            <span>Trạng thái: </span>
            <Radio.Group
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Radio value={1}>Tất cả</Radio>
              <Radio value={2}>Hoạt động</Radio>
              <Radio value={3}>Ngưng hoạt động</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: CustomHeaderCell
            }
          }}
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={filteredData.length}
          onChange={(page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
          }}
        />
      </Card>
    </div>
  );
}
