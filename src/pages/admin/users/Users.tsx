import {
  CheckOutlined,
  DownloadOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  notification,
  Row,
  Table,
} from "antd";
import dayjs from "dayjs";
import React, { useState, useMemo } from "react";
import { JSX } from "react/jsx-runtime";
import { UserAdmin } from "../../../common/types/User";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { useAuth } from "../../../contexts/AuthContext";
import { getAllUser } from "../../../services/authServices";
import * as XLSX from "xlsx";

const customTableHeaderCellStyle: React.CSSProperties = {
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
};

export default function Users() {
  const { IblockUser, UnblockUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(""); // State để lưu trữ giá trị tìm kiếm

  const showBlockModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setReason("");
    setIsModalOpen(false);
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
        userId: selectedUserId,
        shouldBlock: false,
        note: reason,
      });
      handleModalCancel();
    } catch (error) {
      console.error("Lỗi khi chặn người dùng:", error);
      notification.error({ message: "Có lỗi xảy ra khi chặn người dùng." });
    } finally {
      setIsLoading(false);
    }
  };

  const { data: users = [] } = useQuery<UserAdmin[]>({
    queryKey: ["usersAdmin"],
    queryFn: async () => {
      const res = await getAllUser();
      console.log(res.data.users);
      return res.data.users;
    },
  });

  // Lọc người dùng dựa trên tên
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [users, searchText]);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      render: (_: unknown, __: UserAdmin, index: number) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center" as const,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center" as const,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center" as const,
      render: (role: string) => (
        <span style={{ color: role === "admin" ? "black" : "green" }}>
          {role === "admin" ? "Admin" : "User"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt: string) =>
        dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Hành động",
      dataIndex: "key",
      key: "action",
      align: "center" as const,
      render: (_: string, record: UserAdmin) => (
        <Button
          icon={
            record.active ? (
              <StopOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
            ) : (
              <CheckOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
            )
          }
          onClick={() => {
            if (record.active) {
              showBlockModal(record.id);
            } else {
              handleUnBlockId(record.id);
            }
          }}
          style={{ border: "none", marginLeft: "10px" }}
        >
          {record.active ? "Chặn" : "Bỏ chặn"}
        </Button>
      ),
    },
  ];

  const handleUnBlockId = async (id: string) => {
    try {
      await UnblockUser(id);
    } catch (error) {
      console.error("Lỗi khi bỏ chặn người dùng:", error);
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users); // Chuyển đổi dữ liệu thành sheet Excel
    const wb = XLSX.utils.book_new(); // Tạo một workbook mới
    XLSX.utils.book_append_sheet(wb, ws, "Users"); // Thêm sheet vào workbook
    XLSX.writeFile(wb, "users.xlsx"); // Xuất file Excel
  };

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Khách hàng"} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input.Search
              placeholder="Tìm kiếm người dùng"
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
              Export Excel
            </Button>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: (
                props: JSX.IntrinsicAttributes &
                  React.ClassAttributes<HTMLTableHeaderCellElement> &
                  React.ThHTMLAttributes<HTMLTableHeaderCellElement>
              ) => <th {...props} style={customTableHeaderCellStyle} />,
            },
          }}
          dataSource={filteredUsers} // Sử dụng dữ liệu đã lọc
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={false}
          className="table-auto w-full"
          size="middle"
        />
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
      >
        <Input.TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Nhập lý do chặn"
        />
      </Modal>
    </div>
  );
}
