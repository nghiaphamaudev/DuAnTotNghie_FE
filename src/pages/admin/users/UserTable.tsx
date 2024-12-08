import { useQuery } from "@tanstack/react-query";
import { Card, Input, Modal, notification, Switch, Table } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { UserAdmin } from "../../../common/types/User";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { useAuth } from "../../../contexts/AuthContext";
import { getAllUserAccounts } from "../../../services/authServices";
import SearchCustomer from "./SearchCustoms";

export default function Users() {
  const { IblockUser, UnblockUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const showBlockModal = (idUser: string) => {
    setSelectedUserId(idUser);
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
        idUser: selectedUserId,
        status: false,
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
    if (!searchKeyword) return userAccountsData;
    return userAccountsData.filter((user) =>
      user.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, userAccountsData]);

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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      width: 120,
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
      align: "center",
      render: (_: string, record: UserAdmin) => (
        <Switch
          checked={record.active}
          onChange={async (checked) => {
            if (checked) {
              await handleUnBlockId(record.id); 
            } else {
              await showBlockModal(record.id)
            }
          }}
        />
      ),
    }
  ];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={""} />
      <Card style={{ border: "none" }}>
        <SearchCustomer onSearch={handleSearch} dataToExport={filteredAdmins} />
        <div className="relative overflow-x-auto mt-6">
          <Table
            columns={columns}
            dataSource={filteredAdmins}
            pagination={false}
            bordered
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
    </div>
  );
}
