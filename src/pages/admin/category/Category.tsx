import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Input, Row, Switch, Table } from 'antd';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ICategory } from '../../../interface/Categories';
import { getAllCategory, updateCategoryStatus } from "../../../services/categoryServices";
import BreadcrumbsCustom from '../../../components/common/(admin)/BreadcrumbsCustom';
import { useEffect, useState } from 'react';

const customTableHeaderCellStyle: React.CSSProperties = {
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

type CustomTableHeaderCellProps = React.ComponentProps<"th">;

const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

export default function Category() {
  const [dataSource, setDataSource] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isError, isLoading } = useQuery<{ status: string; data: ICategory[] }, Error>({
    queryKey: ["categories"],
    queryFn: getAllCategory
  });

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setDataSource(data.data);
    }
  }, [data]);

  const handleStatusChange = async (checked: boolean, id: string) => {
    setDataSource((prevDataSource) =>
      prevDataSource.map((category) =>
        category.id === id ? { ...category, active: checked } : category
      )
    );

    try {
      const CategoryData = await updateCategoryStatus(id, checked);
      if (CategoryData && CategoryData.data) {
        const { data } = CategoryData;
        setDataSource((prevDataSource) =>
          prevDataSource.map((category) =>
            category.id === data.id ? { ...category, active: data.active } : category
          )
        );
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      setDataSource((prevDataSource) =>
        prevDataSource.map((category) =>
          category.id === id ? { ...category, active: !checked } : category
        )
      );
    }
  };

  // Filter data based on search term
  const filteredData = dataSource.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: "5%",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "20%",
      render: (text: string, record: any) => (
        <Link to={`/admin/category/detail/${record.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
          {text}
        </Link>
      ),
      onFilter: (value: any, record: any) => {
        return record.name.toLowerCase().includes(searchTerm.toLowerCase());
      },
    },
    {
      title: "Ảnh danh mục",
      dataIndex: "imageCategory",
      key: "imageCategory",
      align: "center",
      width: "20%",
      render: (text: string) => (
        text ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={text}
              alt="Category"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "8px",
                textAlign: "center",
              }}
            />
          </div>
        ) : (
          <span>Không có ảnh</span>
        )
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      align: "center",
      width: "10%",
      render: (active: boolean, record: any) => (
        <Switch
          checked={active === true}
          checkedChildren=""
          unCheckedChildren=""
          onChange={(checked) => handleStatusChange(checked, record.id)}
        />
      ),
    },
    {
      title: "Cập nhật",
      key: "update",
      align: "center",
      width: "2%",
      render: (record: ICategory) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }} >
          <Link to={`/admin/category/${record.id}`} >
            <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </Link>
        </div>
      ),
    },
  ];

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Danh mục"} listLink={[]} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input.Search
              placeholder="Tìm kiếm theo tên danh mục"
              onSearch={(value) => setSearchTerm(value)}  // Use this for real-time searching
              enterButton
            />
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              style={{
                float: "right",
              }}
            >
              <Link to="/admin/category/add">Tạo Danh Mục</Link>
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: CustomHeaderCell,
            },
          }}
          dataSource={filteredData}  // Display the filtered data
          columns={columns}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
