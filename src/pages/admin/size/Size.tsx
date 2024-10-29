import {
  EditOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import Search from "antd/es/input/Search";

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

export default function Size() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // add size
  const [openAddSize, setOpenAddSize] = useState(false);
  const [openUpdateSize, setOpenUpdateSize] = useState(false);
  const data = [
    {
      stt: '1',
      sizeCode: 'S',
      name: 'Small',
    },
    {
      stt: '2',
      sizeCode: 'M',
      name: 'Medium',
    },
    {
      stt: '3',
      sizeCode: 'L',
      name: 'Large',
    },
  ];
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      //  render: (_: string, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã kích cỡ",
      dataIndex: "sizeCode",
      key: "sizeCode",
      align: "center" as const,
      width: "15%",
    },
    {
      title: "Tên kích cỡ",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      width: "10%",
      render: () => (
        <Tooltip title={"Cập nhật"}>
          <EditOutlined />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Kích cỡ"} listLink={[]} />
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
              onClick={() => setOpenAddSize(true)}
            >
              Tạo Size
            </Button>

            {/* Modal tạo mới */}
            <Modal
              title="Tạo mới kích cỡ"
              open={openAddSize}
              onCancel={() => setOpenAddSize(false)}
            >
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Mã kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input
                  type="text"

                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Tên kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input
                  type="text"

                />
              </div>
            </Modal>

            {/* Modal cập nhật */}
            <Modal
              title={`Cập nhật kích cỡ`}
              open={openUpdateSize}

              onCancel={() => setOpenUpdateSize(false)}
            >
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Mã kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input type="text" disabled />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Tên kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input
                  type="text"
                />
              </div>
            </Modal>
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
          pagination={{
            current: currentPage,
            pageSize: 5,
            // total: totalSize,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
}
