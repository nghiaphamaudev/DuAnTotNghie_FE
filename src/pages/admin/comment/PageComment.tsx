import { Card, Col, Row, Select, Table, Switch, Radio } from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { useState } from "react";

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

export default function PageComment() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // State để quản lý trạng thái lọc


  const data = [
    {
      key: '1',
      stt: 1,
      fullName: 'Nguyễn Văn A',
      productName: 'Áo thun nam',
      sizeName: 'L',
      rate: 5,
      comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi.',
    },
    {
      key: '2',
      stt: 2,
      fullName: 'Trần Thị B',
      productName: 'Giày thể thao',
      sizeName: '40',
      rate: 4,
      comment: 'Giày đi rất êm chân, nhưng màu sắc không đẹp như mong đợi.',
    },
    {
      key: '3',
      stt: 3,
      fullName: 'Lê Quang C',
      productName: 'Quần jeans',
      sizeName: 'M',
      rate: 3,
      comment: 'Chất liệu ổn, nhưng form hơi rộng so với size thông thường.',
    },
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
      title: "Tên tài khoản",
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeName",
      key: "sizeName",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      key: "rate",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      align: "center" as const,
      width: "30%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "10%",
      render: () => (
        <Switch

        />
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Bình luận"} />
      <Card bordered={false}>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={5}>
            <span>Sản phẩm: </span>
            <Select

              style={{ width: "100%" }}
              value={1}
            >
              <Select.Option value={null}>Tất cả</Select.Option>
            </Select>
          </Col>
          <Col span={5}>
            <span>Khách hàng: </span>
            <Select

              style={{ width: "100%" }}
              value={1}
            >
              <Select.Option value={null}>Tất cả</Select.Option>

              <Select.Option >
                <Select.Option value={1}>User 1</Select.Option>
              </Select.Option>

            </Select>
          </Col>
          <Col span={14}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => {
                setStatusFilter(e.target.value);

              }}
              value={statusFilter}
            >
              <Radio value={null}>Tất cả</Radio>
              <Radio value="1">Hoạt động</Radio>
              <Radio value="0">Ngừng hoạt động</Radio>
            </Radio.Group>
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
          

        />
      </Card>
    </div>
  );
}
