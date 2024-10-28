import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { Button, Card, Col, Image, Radio, Row, Switch, Table } from "antd";
import Search from "antd/es/input/Search";
import {
  DownloadOutlined,
  EyeOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ColumnType } from "antd/es/table";

const customTableHeaderCellStyle: React.CSSProperties = {
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

type CustomTableHeaderCellProps = React.ComponentProps<"th">;

const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

// Dữ liệu sản phẩm với mảng ảnh
const dataSource = [
  {
    key: "1",
    stt: 1,
    name: "Áo thun mùa hè",
    images: [
      "https://picsum.photos/seed/picsum/200/300",
      "https://picsum.photos/seed/picsum2/200/300",
      "https://picsum.photos/seed/picsum3/200/300",
      "https://picsum.photos/seed/picsum3/200/300",
    ],
    category: "Áo mùa hè",
    quantity: 50,
    status: "Hoạt động",
  },
  {
    key: "2",
    stt: 2,
    name: "Áo khoác mùa đông",
    images: [
      "https://picsum.photos/seed/picsum/200/300",
      "https://picsum.photos/seed/picsum2/200/300",
      "https://picsum.photos/seed/picsum3/200/300",
      "https://picsum.photos/seed/picsum3/200/300",
    ],
    category: "Áo mùa đông",
    quantity: 20,
    status: "Ngưng hoạt động",
  },
];

export default function Product() {
  const columns: ColumnType<{
    stt: number;
    key: string;
    name: string;
    images: string[]; // Đảm bảo kiểu dữ liệu là mảng ảnh
    category: string;
    quantity: number;
    status: string;
  }>[] = [
      {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        align: "center" as const,
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: "20%",
        align: "center" as const,
      },
      {
        title: "Ảnh",
        dataIndex: "images", 
        width: "20%",
        align: "center" as const,
        key: "images", 
        render: (images: string[]) => (
          <div style={{ display: "flex", gap: "10px" }}>
            {Array.isArray(images) && images.length > 0 ? (
              images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`product-image-${index}`}
                  width={50}
                />
              ))
            ) : (
              <span>Không có ảnh</span> 
            )}
          </div>
        ),
      },
      {
        title: "Danh mục",
        dataIndex: "category",
        key: "category",
        width: "15%",
        align: "center" as const,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: "10%",
        align: "center" as const,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center" as const,
        width: "10%",
        render: (_, record) => (
          <Switch checked={record.status === "Hoạt động"} />
        ),
      },
      {
        title: "Chi tiết",
        align: "center",
        dataIndex: "key",
        key: "key",
        width: "20%",
        render: (value: string) => (
          <Link to={`/admin/product/detail/${value}`}>
            <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          </Link>
        ),
      },
    ];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Sản phẩm"} />
      {/* Filter section */}
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Search
              placeholder="Nhập tên sản phẩm"
              allowClear
              enterButton="Tìm kiếm"
              size="large"
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
            <Radio.Group value={1}>
              <Radio value={1}>Tất cả</Radio>
              <Radio value={2}>Hoạt động</Radio>
              <Radio value={3}>Ngưng hoạt động</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {/* Product Table */}
      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: CustomHeaderCell,
            },
          }}
          dataSource={dataSource}
          columns={columns}
          rowKey="key"
        />
      </Card>
    </div>
  );
}
