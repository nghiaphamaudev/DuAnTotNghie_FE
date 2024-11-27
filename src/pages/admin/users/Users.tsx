import { CheckOutlined, DownloadOutlined, StopOutlined, } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Row, Select, Table } from "antd";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import { UserAdmin } from "../../../common/types/User";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { useAuth } from "../../../contexts/AuthContext";
import { getAllUser } from "../../../services/authServices";

const { Option } = Select;

const customTableHeaderCellStyle: React.CSSProperties = {
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
};

export default function Users() {

  const { IblockUser, updateroleUser } = useAuth();

  
  // Lấy dữ liệu người dùng từ API
  const { data: users = []} = useQuery<UserAdmin[]>({
    queryKey: ["usersAdmin"],
    queryFn: async () => {
      const res = await getAllUser();
      console.log(res.data.users);
      return res.data.users;
    },
    enabled: true
  });

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
      render: (role: string, record: UserAdmin) => (
        <Select
          defaultValue={role}
          style={{ width: 120,  color: role === "admin" ? "red" : "green", fontWeight: "bold" }}
          onChange={(newRole) => handleRoleChange(record.id, newRole)}  // Gọi hàm khi thay đổi vai trò
        >
          <Option value="admin" >Admin</Option>
          <Option value="user">User</Option>
        </Select>
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
      render: (value: string, record: UserAdmin) => (
        <div>
          <Button
            icon={
              record.active === true ? (  // Kiểm tra trạng thái active của người dùng
                <StopOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
              ) : (
                <CheckOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
              )
            }
            onClick={() => {
              if (record.active === true) {
                handleUnBlockId(record.id);  // Gọi hàm blockUser nếu người dùng đang active
              } else {
                handleBlockUser(record.id); // Gọi hàm unBlockUser nếu người dùng đang không active
              }
            }}
            style={{ border: "none", marginLeft: "10px" }}
          >
            {record.active === true ? "Chặn" : "Bỏ chặn"}
          </Button>
        </div>
      ),
    }
  ];

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateroleUser({ userId, role });
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };
  
  const handleBlockUser = (id: string) => {
    IblockUser(id); // Gọi hàm chặn người dùng
  };

  const handleUnBlockId = async (id: string) => {
    IblockUser(id)
  }

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
        <Table
          components={{ header: { cell: CustomHeaderCell } }}
          dataSource={Array.isArray(users) ? users : []} // Sử dụng dữ liệu từ useQuery
          columns={columns}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
