import {
  DownloadOutlined,
  UserSwitchOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Tag,
  Modal,
} from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import { useState } from "react"; 

const customTableHeaderCellStyle: React.CSSProperties = {
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
};

export default function Users() {
  
  const data = [
    {
      key: '1',
      stt: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      role: 'user', 
      createdAt: '2023-10-14T12:00:00Z',
      status: 'active',
    },
    {
      key: '2',
      stt: 2,
      name: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      role: 'admin',
      createdAt: '2023-10-14T12:00:00Z',
      status: 'active', 
    },
    {
      key: '3',
      stt: 3,
      name: 'Lê Hoàng C',
      email: 'lehoangc@gmail.com',
      role: 'user', 
      createdAt: '2023-10-14T12:00:00Z',
      status: 'blocked', 
    },
    {
      key: '4',
      stt: 4,
      name: 'Phạm Quốc D',
      email: 'phamquocd@gmail.com',
      role: 'user', 
      createdAt: '2023-10-14T12:00:00Z',
      status: 'active', 
    }
  ];

  const [modalVisible, setModalVisible] = useState(false); // Quản lý hiển thị modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedUser, setSelectedUser] = useState<any>(null); // Quản lý người dùng đang được chọn
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
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
      // Hiển thị vai trò dưới dạng thẻ Tag với màu sắc tùy thuộc vào vai trò
      render: (role: string) => (
        <Tag color={role === "admin" ? "green" : "blue"}>
          {role === "admin" ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      render: (createdAt: string) => dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Hành động",
      dataIndex: "key",
      key: "action",
      align: "center" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: string, record: any) => (
        <div>
          {/* Nút chuyển vai trò (chỉnh sửa) */}
          <Button
            icon={<UserSwitchOutlined style={{ fontSize: "20px", color: "#1890ff" }} />}
            onClick={() => openRoleModal(record)} // Mở modal để chỉnh sửa vai trò
            style={{ border: "none" }}
          />

          {/* Nút Chặn hoặc Bỏ chặn */}
          <Button
            icon={
              record.status === 'active' ? (
                <StopOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
              ) : (
                <CheckOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
              )
            }
            onClick={() => {
              if (record.status === 'active') {
                blockUser(record.key); // Chặn người dùng nếu họ đang hoạt động
              } else {
                unBlockUser(record.key); // Bỏ chặn người dùng nếu họ bị chặn
              }
            }}
            style={{ border: "none", marginLeft: "10px" }}
          >
            {record.status === 'active' ? "Chặn" : "Bỏ chặn"}
          </Button>
        </div>
      ),
    }
  ];

  // Hàm mở modal chỉnh sửa vai trò của người dùng
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openRoleModal = (user: any) => {
    setSelectedUser(user); // Lưu thông tin người dùng được chọn
    setModalVisible(true); // Hiển thị modal
  };

  // Hàm cập nhật vai trò của người dùng
  const handleRoleUpdate = (role: string) => {
    console.log(`Cập nhật người dùng ${selectedUser?.name} thành vai trò ${role}`);
    // Logic cập nhật vai trò ở đây (có thể gọi API)
    setModalVisible(false); // Đóng modal sau khi cập nhật
  };

  // Hàm chặn người dùng
  const blockUser = (key: string) => {
    console.log(`Chặn người dùng có key ${key}`);
    // Logic chặn người dùng ở đây (có thể gọi API)
  };

  // Hàm bỏ chặn người dùng
  const unBlockUser = (key: string) => {
    console.log(`Bỏ chặn người dùng có key ${key}`);
    // Logic bỏ chặn người dùng ở đây (có thể gọi API)
  };

  // Cấu hình custom header cell cho bảng
  const CustomHeaderCell: React.FC<React.ComponentProps<"th">> = (props) => (
    <th {...props} style={customTableHeaderCellStyle} />
  );

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Khách hàng"} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
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
              Export Excel
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "12px" }}>
        {/* Bảng hiển thị dữ liệu */}
        <Table
          components={{ header: { cell: CustomHeaderCell } }}
          dataSource={data}
          columns={columns}
          rowKey="key"
        />
      </Card>

      {/* Modal để chỉnh sửa vai trò người dùng */}
      <Modal
        title="Chỉnh sửa vai trò"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {/* Nút để chỉ định vai trò cho người dùng */}
        <Button
          type="default"
          style={{ margin: "5px" }}
          onClick={() => handleRoleUpdate("admin")} // Cập nhật vai trò thành admin
        >
          Chỉ định làm Admin
        </Button>
        <Button
          type="default"
          style={{ margin: "5px" }}
          onClick={() => handleRoleUpdate("user")} // Cập nhật vai trò thành user
        >
          Chỉ định làm User
        </Button>
      </Modal>
    </div>
  );
}
