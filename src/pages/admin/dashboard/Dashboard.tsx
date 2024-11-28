import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography, Row, Col } from "antd";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Đăng ký các thành phần của ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  // Giả lập dữ liệu
  const [orders, setOrders] = useState(50);
  const [inventory, setInventory] = useState(200);
  const [customers, setCustomers] = useState(120);
  const [revenue, setRevenue] = useState(15000);

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Typography.Title level={3} style={{ textAlign: "center" }}>
        Dashboard
      </Typography.Title>
      <Row gutter={[16, 16]} justify="space-between">
        <Col xs={24} sm={12} md={6}>
          <DashboardCard
            icon={<ShoppingCartOutlined />}
            title="Orders"
            value={orders}
            iconColor="green"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DashboardCard
            icon={<ShoppingOutlined />}
            title="Inventory"
            value={inventory}
            iconColor="blue"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DashboardCard
            icon={<UserOutlined />}
            title="Customers"
            value={customers}
            iconColor="purple"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DashboardCard
            icon={<DollarCircleOutlined />}
            title="Revenue"
            value={revenue}
            iconColor="red"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <RecentOrders />
        </Col>
        <Col xs={24} md={12}>
          <DashboardChart />
        </Col>
      </Row>
    </div>
  );
}

function DashboardCard({ title, value, icon, iconColor }) {
  return (
    <Card bordered={false} style={{ textAlign: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <Space direction="vertical">
        <div
          style={{
            backgroundColor: `rgba(${iconColor === "green" ? "0,255,0" : iconColor === "blue" ? "0,0,255" : iconColor === "purple" ? "255,0,255" : "255,0,0"}, 0.25)`,
            borderRadius: "50%",
            padding: "12px",
            fontSize: "24px",
            color: iconColor,
          }}
        >
          {icon}
        </div>
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

function RecentOrders() {
  // Giả lập dữ liệu của đơn hàng gần đây
  const dataSource = [
    { title: "Product 1", quantity: 2, discountedPrice: 100 },
    { title: "Product 2", quantity: 1, discountedPrice: 150 },
    { title: "Product 3", quantity: 3, discountedPrice: 200 },
  ];

  return (
    <>
      <Typography.Text style={{ fontWeight: "bold" }}>Recent Orders</Typography.Text>
      <Table
        columns={[
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
          },
          {
            title: "Price",
            dataIndex: "discountedPrice",
          },
        ]}
        dataSource={dataSource}
        pagination={false}
        style={{ marginTop: "16px" }}
      />
    </>
  );
}

function DashboardChart() {
  // Giả lập dữ liệu cho biểu đồ doanh thu
  const reveneuData = {
    labels: ["User-1", "User-2", "User-3", "User-4"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 4000, 3000, 2000],
        backgroundColor: "rgba(255, 0, 0, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Order Revenue",
      },
    },
  };

  return (
    <Card style={{ height: "100%", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <Bar options={options} data={reveneuData} />
    </Card>
  );
}

export default Dashboard;
