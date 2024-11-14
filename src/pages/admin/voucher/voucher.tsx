import { PlusCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Table,

} from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";

import { Link } from "react-router-dom";



export default function Voucher() {
  const { Search } = Input;
  const data = [
    {
      key: '1',
      stt: 1,
      code: 'DISCOUNT10',
      description: 'Giảm 10% cho đơn hàng trên 500K',
      quantity: 100,
      usedCount: 20,
      discountType: '10%',
      startDate: '2024-01-01',
      expirationDate: '2024-12-31',
      status: 'Hoạt động',
    },
    {
      key: '2',
      stt: 2,
      code: 'DISCOUNT20',
      description: 'Giảm 20% cho đơn hàng trên 1 triệu',
      quantity: 50,
      usedCount: 10,
      discountType: '20%',
      startDate: '2024-02-01',
      expirationDate: '2024-10-31',
      status: 'Hoạt động',
    },
    {
      key: '3',
      stt: 3,
      code: 'FREESHIP50',
      description: 'Miễn phí vận chuyển cho đơn hàng trên 50K',
      quantity: 200,
      usedCount: 80,
      discountType: 'Miễn phí vận chuyển',
      startDate: '2024-03-15',
      expirationDate: '2024-09-30',
      status: 'Ngưng hoạt động',
    },
    {
      key: '4',
      stt: 4,
      code: 'NEWYEAR30',
      description: 'Giảm 30% cho đơn hàng dịp Tết',
      quantity: 150,
      usedCount: 70,
      discountType: '30%',
      startDate: '2024-01-25',
      expirationDate: '2024-02-10',
      status: 'Hoạt động',
    },
    {
      key: '5',
      stt: 5,
      code: 'HALFPRICE50',
      description: 'Giảm 50% cho sản phẩm thứ 2',
      quantity: 300,
      usedCount: 150,
      discountType: '50%',
      startDate: '2024-06-01',
      expirationDate: '2024-08-31',
      status: 'Hoạt động',
    },
    {
      key: '6',
      stt: 6,
      code: 'SUMMER15',
      description: 'Giảm 15% cho các sản phẩm mùa hè',
      quantity: 120,
      usedCount: 50,
      discountType: '15%',
      startDate: '2024-05-01',
      expirationDate: '2024-07-30',
      status: 'Ngưng hoạt động',
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
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      align: "center" as const,
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center" as const,
      width: "15%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Đã sử dụng",
      dataIndex: "usedCount",
      key: "usedCount",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      align: "center" as const,
      width: "10%",

    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      align: "center" as const,
      width: "10%",

    },
    {
      title: "Ngày kết thúc",
      dataIndex: "expirationDate",
      key: "expirationDate",
      align: "center" as const,
      width: "10%",

    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "10%",

    },

  ];

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Mã giảm giá"} listLink={[]} />
      {/* filter */}
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
                float: "right",
              }}
            >
              <Link to="/admin/voucher/add">Tạo mã</Link>
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
      <Card style={{ marginTop: "12px" }}>
        <Table

          dataSource={data}
          columns={columns}
        />
      </Card>
    </div>
  );
}
