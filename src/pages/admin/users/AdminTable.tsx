import { PlusCircleFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Table,
} from "antd";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { RegisterAdminRequest, UserAdmin } from "../../../common/types/User";
import { useAuth } from "../../../contexts/AuthContext";
import { getSuperAndAdmin } from "../../../services/authServices";
import SearchCustomer from "./SearchCustoms";
import { Radio } from "antd";
import { RadioChangeEvent } from "antd/lib";

const { Option } = Select;

const AdminTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [passwordForm] = Form.useForm();
  const [form] = Form.useForm();
  const {
    IblockAdmin,
    UnblockAdmin,
    IregisterAdmin,
    changePasswordAdmin,
    user,
  } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number>(1);
  const isAdmin = user?.role === "admin";

  const { data: adminAccount = [] } = useQuery<UserAdmin[]>({
    queryKey: ["AdminAccount"],
    queryFn: async () => {
      const res = await getSuperAndAdmin();
      return res.admins.data;
    },
  });

  const filteredAdmins = useMemo(() => {
    let admins = adminAccount;

    if (searchKeyword) {
      admins = admins.filter((admin) =>
        admin.fullName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (statusFilter === 2) {
      admins = admins.filter((admin) => admin.active); // Hoạt động
    } else if (statusFilter === 3) {
      admins = admins.filter((admin) => !admin.active); // Ngưng hoạt động
    }

    return admins;
  }, [searchKeyword, statusFilter, adminAccount]);
  const handleStatusFilterChange = (e: RadioChangeEvent) => {
    setStatusFilter(e.target.value);
  };

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

  const openPasswordModal = (adminId: string) => {
    setSelectedAdminId(adminId);
    setIsPasswordModalVisible(true);
  };

  const handleChangePassword = async (values: { resetPassword: string }) => {
    if (!selectedAdminId) return;
    await changePasswordAdmin({
      idAdmin: selectedAdminId,
      assignedRole: "manage-users",
      resetPassword: values.resetPassword,
    });
    setIsPasswordModalVisible(false);
    passwordForm.resetFields();
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
      render: (role: string) => (
        <span
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: "400",
          }}
        >
          {role}
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
  ];
  const superAdminColumns = [
    {
      title: "Trạng thái",
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
          }}
        />
      ),
    },
    {
      title: "Hành động",
      align: "center",
      width: 120,
      render: (_: string, record: UserAdmin) => (
        <Button type="link" onClick={() => openPasswordModal(record._id)}>
          Đổi mật khẩu
        </Button>
      ),
    },
  ];

  const columns = isAdmin
    ? columnsAdmin
    : [...columnsAdmin, ...superAdminColumns];

  return (
    <>
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
        <div className="mt-4 flex absolute top-14 right-6">
          {!isAdmin && (
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
          )}
        </div>
        <div className="relative overflow-x-auto mt-14">
          <Table
            columns={columns}
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
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải dài ít nhất 6 ký tự" },
              {
                pattern: /[a-z]/,
                message: "Mật khẩu ít nhất phải có một chữ thường",
              },
              {
                pattern: /[\d]/,
                message: "Mật khẩu ít nhất phải có một số",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            initialValue="admin"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select disabled>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đổi Mật Khẩu"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        cancelText="Hủy"
        okText="Đổi mật khẩu"
        onOk={() => passwordForm.submit()}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="resetPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải dài ít nhất 6 ký tự" },
              {
                pattern: /[a-z]/,
                message: "Mật khẩu ít nhất phải có một chữ thường",
              },
              {
                pattern: /[\d]/,
                message: "Mật khẩu ít nhất phải có một số",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminTable;
