import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  notification,
  Radio,
  RadioChangeEvent,
  Row,
  Switch,
  Table,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { UserAdmin } from "../../../common/types/User";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { useAuth } from "../../../contexts/AuthContext";
import { getAllUserAccounts } from "../../../services/authServices";
import SearchCustomer from "./SearchCustoms";
import OrdersTable from "./OrderTable";

const { Title } = Typography;
export default function Users() {
  const { IblockUser, UnblockUser, UpdatePaymentRestriction, UnUpdatePaymentRestriction } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number>(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<UserAdmin | null>(null);
  const [isActive, setIsActive] = useState(selectedUserDetail?.active);
  const [isActivePayment, setIsActivePayment] = useState(selectedUserDetail?.paymentRestriction);


  useEffect(() => {
    setIsActivePayment(selectedUserDetail?.paymentRestriction);  
  }, [selectedUserDetail?.paymentRestriction]); 
  
  const handleSwitchChangePayMent = async (checked: boolean) => {
    if (checked) {
      await handleUpdatePaymentRestriction(selectedUserDetail?.id || "");
      setIsActivePayment(true);
    } else {
      await handleUnUpdatePaymentRestriction(selectedUserDetail?.id || "");
      setIsActivePayment(false);
    }
  };

  const handleUpdatePaymentRestriction = async (userId: string) => {
    await UpdatePaymentRestriction({
      userId,
      restrictPayment: true,  
    });
  }

  const handleUnUpdatePaymentRestriction = async (userId: string) => {
    await UnUpdatePaymentRestriction({
      userId,
      restrictPayment: false, 
    });
  }

  useEffect(() => {
    setIsActive(selectedUserDetail?.active);
  }, [selectedUserDetail?.active]);

  const handleSwitchChange = async (checked: boolean) => {
    if (!checked) {
      await showBlockModal(selectedUserDetail?.id || "");
      setIsActive(false);
    } else {
      await handleUnBlockId(selectedUserDetail?.id || "");
      setIsActive(true);
    }
  };

  const handleViewDetails = async (record: UserAdmin) => {
    setSelectedUserDetail(record); 
    setIsDetailModalOpen(true);
    setSelectedUserId(record.id); 
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalOpen(false);
    setSelectedUserDetail(null);
  };

  const showBlockModal = (idUser: string) => {
    setSelectedUserId(idUser);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setReason("");
    setIsModalOpen(false);
    setIsActive(true);
  };

  const handleConfirmBlock = async () => {
    if (!reason) {
      notification.warning({ message: "Vui lòng nhập lý do chặn." });
      return;
    }

    if (!selectedUserId) return;
    setIsLoading(true);

    try {
      await IblockUser({
        idUser: selectedUserId,
        status: false,
        note: reason,
      });
      handleModalCancel();
      setIsActive(false);
    } catch (error) {
      console.error("Lỗi khi chặn người dùng:", error);
      notification.error({ message: "Có lỗi xảy ra khi chặn người dùng." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnBlockId = async (id: string) => {
    await UnblockUser(id);
  };

  const { data: userAccountsData = [] } = useQuery<UserAdmin[]>({
    queryKey: ["usersAdmin"],
    queryFn: async () => {
      const res = await getAllUserAccounts();
      return res.data.list;
    },
  });

  const filteredAdmins = useMemo(() => {
    let filteredData = userAccountsData;

    // Lọc theo trạng thái
    if (statusFilter === 2) {
      // Hoạt động
      filteredData = filteredData.filter((user) => user.active);
    } else if (statusFilter === 3) {
      // Ngưng hoạt động
      filteredData = filteredData.filter((user) => !user.active);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword) {
      filteredData = filteredData.filter((user) =>
        user.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    return filteredData;
  }, [statusFilter, searchKeyword, userAccountsData]);

  const handleStatusFilterChange = (e: RadioChangeEvent) => {
    setStatusFilter(e.target.value); // Cập nhật trạng thái bộ lọc
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: "center",
      render: (_: unknown, __: UserAdmin, index: number) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (text: string) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={text}
            alt="cover"
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      ),
    },
    { title: "Tên", dataIndex: "fullName", key: "fullName", align: "center" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "key",
      key: "action",
      align: "center",
      render: (_: string, record: UserAdmin) => (
        <Button
          type="primary"
          style={{
            backgroundColor: record.active ? "#4CAF50" : "#FF7043",
            borderColor: record.active ? "#4CAF50" : "#FF7043",
            color: "white", 
          }}
        >
          {record.active ? "Hoạt động" : "Ngưng hoạt động"}
        </Button>
      ),
    },
    {
      title: "Tổng số đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
      width: 120,
    },
    {
      title: "Hoàn trả",
      dataIndex: "totalReturnOrders",
      key: "totalReturnOrders",
      align: "center",
      width: 120,
    },
    {
      title: "Người thực hiện",
      dataIndex: "handleBy",
      key: "handleBy",
      align: "center",
      width: 120,
      render: (_: string, record: UserAdmin) => {
        if (record.blockedDetail && record.blockedDetail.handleBy) {
          return `${record.blockedDetail.handleBy}`;
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "",
      align: "center",
      width: 120,
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: UserAdmin) => (
        <button
          onClick={() => handleViewDetails(record)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Xem chi tiết
        </button>
      ),
      
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={""} />
      <Card style={{ border: "none" }}>
        <SearchCustomer onSearch={handleSearch} dataToExport={filteredAdmins} />
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
        <div className="relative overflow-x-auto mt-6">
          <Table
            columns={columns}
            dataSource={filteredAdmins}
            pagination={false}
            bordered
            rowKey={(record) => record.id}
          />
        </div>
      </Card>
      <Modal
        title="Nhập lý do chặn người dùng"
        visible={isModalOpen}
        onOk={handleConfirmBlock}
        onCancel={handleModalCancel}
        okButtonProps={{
          loading: isLoading,
          disabled: isLoading,
        }}
        cancelButtonProps={{
          disabled: isLoading,
        }}
        okText="Gửi"
        cancelText="Hủy"
        closable={false}
      >
        <Input.TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Nhập lý do chặn"
        />
      </Modal>
      <Modal
        visible={isDetailModalOpen}
        onCancel={handleDetailModalCancel}
        footer={null}
        width={800}
        style={{ padding: 20 }}
        bodyStyle={{ padding: "24px 36px" }}
      >
          <Title level={4} style={{ color: "#28a745" }}>
            Lịch sử đơn hàng
          </Title>
          <OrdersTable userId={selectedUserId}/>
 

        <Card bordered={false} className="mb-6">
          <Title level={4} style={{ color: "#28a745" }}>
            Thông số
          </Title>
          <div className="flex justify-between items-center mt-4">
            <div className="mr-2 text-md">Tổng số đơn hàng đã thực hiện:</div>
            <span>
              {selectedUserDetail ? selectedUserDetail.totalOrders : 0} đơn hàng
            </span>
          </div>
          <div className="flex justify-between items-center mt-4">
            {/* Thành công */}
            <div className="flex items-center">
              <div className="mr-2 text-md">Thành công:</div>
              <span>
                {selectedUserDetail ? selectedUserDetail.totalSuccessOrders : 0}{" "}
                đơn hàng
              </span>
            </div>

            {/* Tỉ lệ thành công */}
            <div className="flex items-center">
              <div className="mr-2 text-md">Tỉ lệ thành công:</div>
              <span>
                {selectedUserDetail ? selectedUserDetail.successRate : 0} %
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            {/* Hủy và Tỉ lệ hủy */}
            <div className="flex items-center">
              <div className="mr-2 text-md">Hủy:</div>
              <span>
                {selectedUserDetail
                  ? selectedUserDetail.totalCanceledOrders
                  : 0}{" "}
                đơn hàng
              </span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 text-md">Tỉ lệ hủy:</div>
              <span>
                {selectedUserDetail ? selectedUserDetail.cancelRate : 0} %
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            {/* Hoàn trả và Tỉ lệ hoàn trả */}
            <div className="flex items-center">
              <div className="mr-2 text-md">Hoàn trả:</div>
              <span className="mt-0">
                {selectedUserDetail ? selectedUserDetail.totalReturnOrders : 0}{" "}
                đơn hàng
              </span>
            </div>
            <div className="flex items-center ">
              <div className="mr-2 text-md">Tỉ lệ hoàn trả:</div>
              <span>
                {selectedUserDetail ? selectedUserDetail.returnRate : 0} %
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="mr-2 text-md">Thiệt hại cửa hàng:</div>
            <span>
              {selectedUserDetail
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedUserDetail.totalDamage)
                : "0 đ"}
            </span>
          </div>
        </Card>

        <Card bordered={false} className="mb-6">
          <Title level={4} className="mt-6 mb-4 " style={{ color: "#28a745" }}>
            Hành động
          </Title>

          <div className="flex justify-between items-center mt-6">
            <Title level={5} style={{ margin: 0 }}>
              Yêu cầu thanh toán trước
            </Title>
            <Switch checked={isActivePayment} onChange={handleSwitchChangePayMent}/>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Title level={5} style={{ margin: 0 }}>
              Khóa tài khoản tạm thời
            </Title>
            <Switch checked={!isActive} onChange={(checked) => handleSwitchChange(!checked)} />
          </div>
        </Card>
      </Modal>
    </div>
  );
}
