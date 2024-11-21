import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Row, Table } from 'antd';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ICategory } from '../../../interface/Categories';
import { getAllCategory } from "../../../services/categoryServices"; // Import hàm getAllCategory
import BreadcrumbsCustom from '../../../components/common/(admin)/BreadcrumbsCustom';
import { Search } from 'lucide-react';

const customTableHeaderCellStyle: React.CSSProperties = {
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

// Define the type for Table Header Cell Props
type CustomTableHeaderCellProps = React.ComponentProps<"th">;

const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

export default function Category() {
  // Sử dụng useQuery để gọi API lấy tất cả danh mục
  const { data, isError } = useQuery<{ status: string, data: ICategory[] }, Error>({
    queryKey: ["categories"], // Khóa duy nhất cho truy vấn
    queryFn: getAllCategory, // Hàm gọi API từ service getAllCategory
  });

  console.log('Fetched data:', data);  // In dữ liệu để kiểm tra

  // Kiểm tra nếu dữ liệu trả về có dạng mảng hay không
  const dataSource = Array.isArray(data?.data) ? data.data : [];

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      render: (_: any, __: any, index: number) => index + 1, // Tạo STT tự động
    },
    {
      title: "Tên danh mục",
      dataIndex: "name", // Chỉnh lại để phù hợp với cấu trúc dữ liệu trả về
      key: "name",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Cập nhật",
      key: "update",
      align: "center" as const,
      width: "2%",
      render: (record: ICategory) => (
        <Link to={`/admin/category/${record.id}`}>
          <EditOutlined />
        </Link>
      ),
    },
  ];

  // Kiểm tra nếu có lỗi
  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Danh mục"} listLink={[]} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Search />
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              icon={<PlusCircleFilled />}
              style={{
                float: "right"
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
          dataSource={dataSource}
          columns={columns}
          rowKey="_id"
        />
      </Card>
    </div>
  );
}
