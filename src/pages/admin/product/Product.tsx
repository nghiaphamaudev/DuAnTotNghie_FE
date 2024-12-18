/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusCircleFilled
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Input, Radio, Row, Switch, Table } from "antd";
import { ColumnType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { Products, ProductVariant } from "../../../common/types/Product";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import {
  deleteProductStatus,
  getAllProduct
} from "../../../services/productServices";
import { socket } from "../../../socket";

export default function Product() {
  const [dataSource, setDataSource] = useState<Products[]>([]);
  const [statusFilter, setStatusFilter] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { Search } = Input;
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  // Fetch products function
  const { data, isError, isLoading } = useQuery<
    { status: string; data: Products[] },
    Error
  >({
    queryKey: ["products"],
    queryFn: getAllProduct
  });

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setDataSource(data.data);
    }
  }, [data]);
  
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },[pathname.includes("/admin/product")])

  const filteredData = dataSource
    .filter((product) => {
      if (statusFilter === 2) return product.isActive === true;
      if (statusFilter === 3) return product.isActive === false;
      return true;
    })
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase().trim());
  };
  const handleStatusChange = async (checked: boolean, id: string) => {
    try {
      const productData = await deleteProductStatus(id, checked);
      if (productData && productData.data) {
        const { data } = productData;
        socket.emit("hidden product", id);
        setDataSource((prevDataSource) =>
          prevDataSource.map((product) =>
            product.id === data.id
              ? { ...product, isActive: data.isActive }
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

  if (isLoading) {
    return (
      <div>
        <LoadingOutlined />
      </div>
    );
  }
  if (isError) {
    return <div>Error fetching data</div>;
  }

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
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: "15%",
      align: "center",
      render: (category: { name: string }) =>
        category ? category.name : "Chưa có danh mục"
    },
    {
      title: "Số lượng",
      dataIndex: "variants",
      key: "quantity",
      width: "10%",
      align: "center",
      render: (variants: ProductVariant[]) => {
        const totalQuantity = variants.reduce((total, variant) => {
          const variantQuantity = variant.sizes.reduce(
            (sum, size) => sum + (size.inventory || 0),
            0
          );
          return total + variantQuantity;
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
          onChange={(checked) => handleStatusChange(checked, record.id)}
        />
      )
    },
    {
      title: "Chi tiết",
      align: "center",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Link to={`/admin/product/${record.id}`}>
            <EditOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          </Link>
          <Link to={`/admin/product/detail/${record.id}`}>
            <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          </Link>
        </div>
      )
    }
  ];

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm");
    XLSX.writeFile(wb, "products.xlsx");
  };

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Sản phẩm"} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm theo mã hoặc mô tả"
              allowClear
              enterButton="Tìm kiếm"
              size="middle"
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
              <Link to="/admin/product/add">Tạo sản phẩm</Link>
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
          dataSource={filteredData.slice().reverse()}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  );
}
