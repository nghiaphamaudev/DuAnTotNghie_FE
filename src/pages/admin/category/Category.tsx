import {
  EditOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Table } from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";
import { ICategory } from "../../../interface/Categories";

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
  const data = [
    {
      key: '1',
      stt: 1,
      loai: 'Áo thu đông',
    },
    {
      key: '2',
      stt: 2,
      loai: 'Áo hè',
    }
  ];


  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",

    },
    {
      title: "Tên danh mục",
      dataIndex: "loai",
      key: "loai",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Cập nhật",
      key: "update",
      align: "center" as const,
      width: "2%",
      render: (record: ICategory) => (
        <Link to={`/admin/category/${record._id}`}>
          <EditOutlined />
        </Link>
      ),
    },
  ]
  return (
    <div>
      <BreadcrumbsCustom nameHere={"Danh mục"} listLink={[]} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
            //  onSearch={onSearch}
            />
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
          dataSource={data}
          columns={columns}
          rowKey="_id"

        />
      </Card>
    </div>
  );
}
