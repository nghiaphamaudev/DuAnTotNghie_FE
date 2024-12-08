import { PlusCircleFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Form, Input, Modal, Select, Switch, Table } from "antd";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { RegisterAdminRequest, UserAdmin } from "../../../common/types/User";
import { useAuth } from "../../../contexts/AuthContext";
import { getSuperAndAdmin } from "../../../services/authServices";
import SearchCustomer from "./SearchCustoms";

const { Option } = Select;

const AdminTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { IblockAdmin, UnblockAdmin, IregisterAdmin } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const { data: adminAccount = [] } = useQuery<UserAdmin[]>({
    queryKey: ["AdminAccount"],
    queryFn: async () => {
      const res = await getSuperAndAdmin();
      return res.admins.data;
    },
  });

  const filteredAdmins = useMemo(() => {
    if (!searchKeyword) return adminAccount;
    return adminAccount.filter((admin) =>
      admin.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, adminAccount]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleBlock = async (id: string) => {
    await IblockAdmin({
      idAdmin: id,
      status: false,
    });
  };
  const handleUnBlockId = async (id: string) => {
    await UnblockAdmin(id);
  };

  const handleCreateAdmin = async (data: RegisterAdminRequest) => {
    await IregisterAdmin(data);
    form.resetFields();
    setIsModalVisible(false);
  };

  const columnsAdmin = [
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
      dataIndex: "coverImg",
      key: "coverImg",
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
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_: string, record: UserAdmin) => (
        <Switch
          checked={record.active}
          onChange={async (checked) => {
            if (checked) {
              await handleUnBlockId(record._id);
            } else {
              await handleBlock(record._id);
            }
            console.log(record);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Card style={{ border: "none" }}>
        <SearchCustomer onSearch={handleSearch} dataToExport={filteredAdmins} />
        <div className="mt-4 flex absolute top-14 right-6">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              marginLeft: "12px",
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
            icon={<PlusCircleFilled />}
            onClick={() => setIsModalVisible(true)}
          >
            Tạo tài khoản Admin
          </Button>
        </div>
        <div className="relative overflow-x-auto mt-14">
          <Table
            columns={columnsAdmin}
            dataSource={filteredAdmins}
            pagination={false}
            bordered
          />
        </div>
      </Card>

      <Modal
        title="Tạo Tài Khoản"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        cancelText="Hủy"
        okText="Tạo tài khoản"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateAdmin}>
          <Form.Item
            name="fullName"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            initialValue="admin"
            rules={[
              { required: true, message: "Vui lòng chọn vai trò!" },
              () => ({
                validator(_, value) {
                  if (value === "admin") return Promise.resolve();
                  return Promise.reject(
                    new Error("Vai trò chỉ được phép là Admin!")
                  );
                },
              }),
            ]}
          >
            <Select disabled>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminTable;
