/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Switch, Table, Radio, Input } from "antd";
import { DownloadOutlined, EditOutlined, EyeOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { deleteProductStatus, getAllProduct } from '../../../services/productServices';
import { Products, ProductVariant } from '../../../common/types/Product';
import { ColumnType } from 'antd/es/table';
import BreadcrumbsCustom from '../../../components/common/(admin)/BreadcrumbsCustom';
import * as XLSX from 'xlsx';
import { useQuery } from '@tanstack/react-query';

export default function Product() {
  const [dataSource, setDataSource] = useState<Products[]>([]);
  const [statusFilter, setStatusFilter] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { Search } = Input;
  // Fetch products function
  const { data, isError, isLoading } = useQuery<{ status: string; data: Products[] }, Error>({
    queryKey: ["products"],
    queryFn: getAllProduct
  });

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setDataSource(data.data);
    }
  }, [data]);

  const filteredData = dataSource
    .filter(product => {
      // Lọc theo trạng thái
      if (statusFilter === 2) return product.isActive === true; 
      if (statusFilter === 3) return product.isActive === false; 
      return true; 
    })
    .filter(product =>
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
        setDataSource(prevDataSource =>
          prevDataSource.map(product =>
            product.id === data.id ? { ...product, isActive: data.isActive } : product
          )
        );
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái sản phẩm:', error);
    }
  };
  const handleStatusFilterChange = (e: any) => {
    setStatusFilter(e.target.value);
  };
  if (isLoading) {
    <div>...Loading</div>;
  };
  if (isError) {
    return <div>Error fetching data</div>;
  };


  const columns: ColumnType<Products>[] = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "20%",
      align: "center",
      onFilter: (_value: any, record: any) => {
        return record.name.toLowerCase().includes(searchTerm.toLowerCase());
      },
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'coverImg',
      render: (coverImg) => (
        <img src={coverImg} alt="Cover" style={{ width: 100, height: 100 }} />
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: "15%",
      align: "center",
      render: (category: { name: string }) => category ? category.name : "Chưa có danh mục",
    },
    {
      title: "Số lượng",
      dataIndex: "variants",
      key: "quantity",
      width: "10%",
      align: "center",
      render: (variants: ProductVariant[]) => {
        if (!Array.isArray(variants)) {
          return 0;
        }

        const totalQuantity = variants.reduce((total, variant) => {
          if (!variant || !Array.isArray(variant.sizes)) {
            return total;
          }

          const variantQuantity = variant.sizes.reduce((sum, size) => {
            return sum + (size.inventory || 0);
          }, 0);

          return total + variantQuantity;
        }, 0);

        return totalQuantity;
      },
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
      ),
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
            <EyeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </Link>
        </div>
      ),
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
                borderColor: "green",
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
            <Radio.Group value={statusFilter} onChange={handleStatusFilterChange}>
              <Radio value={1}>Tất cả</Radio>
              <Radio value={2}>Hoạt động</Radio>
              <Radio value={3}>Ngưng hoạt động</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "12px" }}>
        <Table dataSource={filteredData.slice().reverse()} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
