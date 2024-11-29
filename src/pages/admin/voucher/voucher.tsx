/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { LoadingOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Button, Card, Col, Input, Radio, Row, Switch, Table, message } from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVouchers, updateVoucherStatus } from "../../../services/voucher";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
export default function Voucher() {
  const { Search } = Input;
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => await fetchVouchers(),
  });
  const [filterStatus, setFilterStatus] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>(""); 
  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      await updateVoucherStatus(id, status),
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({
        queryKey: ["vouchers"],
      }); 
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại!");
    },
  });
  const handleStatusChange = (e: any) => {
    setFilterStatus(e.target.value);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value.toLowerCase().trim());
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Hàm thay đổi trạng thái
  const onSwitchChange = (checked: boolean, record: any) => {
    const newStatus = checked ? "active" : "inactive";
    mutation.mutate({ id: record._id, status: newStatus });
    console.log(record._id);
    
  };
  const filteredData = data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.filter((voucher: any) => {
      if (filterStatus === 2) return voucher.status === "active"; 
      if (filterStatus === 3) return voucher.status === "inactive"; 
      return true; 
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((voucher: any) => {
      if (!searchKeyword) return true; 
      return (
        voucher.code.toLowerCase().includes(searchKeyword) || 
        voucher.description?.toLowerCase().includes(searchKeyword) 
      );
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnsType<any> =[
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      render: (_text: any, _record: any, index: number) => index + 1,
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
      render: (_text: string, record: any) =>
        record.discountType === "percentage"
          ? `${record.discountPercentage}%`
          : `${record.discountAmount} VNĐ`,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      align: "center" as const,
      width: "10%",
      render: (startDate: string) =>
        dayjs(startDate).format("DD/MM/YYYY HH:mm"), 
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "expirationDate",
      key: "expirationDate",
      align: "center" as const,
      width: "10%",
      render: (expirationDate: string) =>
        dayjs(expirationDate).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "10%",
      render: (_status: string, record: any) => {
        const isExpired = dayjs(record.expirationDate).isBefore(dayjs());
        const finalStatus = isExpired ? "inactive" : _status;
        return (
          <Switch
            checked={finalStatus === "active"}
            onChange={(checked) => onSwitchChange(checked, record)}
            disabled={isExpired} 
          />
        );
      },
    },
  ];

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingOutlined />
      </div>
    );
  if (isError) return <div>Error</div>;

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Mã giảm giá"} listLink={[]} />
      {/* Filter */}
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Search
              placeholder="Tìm kiếm theo mã hoặc mô tả"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={handleSearch}
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
            <Radio.Group onChange={handleStatusChange} value={filterStatus}>
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
