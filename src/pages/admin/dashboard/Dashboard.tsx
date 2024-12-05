
import { Row, Col, Card, Typography } from 'antd';
import UserStatisticsTable from './UserStatisticsTable';
import TopProductsTable from './TopProductsTable';
import OrderStatusPieChart from './OrderStatusPieChart';
import InventoryTable from './InventoryTable';
import RevenueBarChart from './RevenueBarChart';

const { Title } = Typography;

const Dashboard = () => (
  <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    {/* Tiêu đề trang */}
    <Row>
      <Col span={24}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#595959' }}>
          Dashboard Thống Kê
        </Title>
      </Col>
    </Row>
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card  bordered={false}>
            <UserStatisticsTable />
          </Card>
        </Col>
      </Row>
    </div>

    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card  bordered={false}>
            <TopProductsTable />
          </Card>
        </Col>
      </Row>
    </div>
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card bordered={false}>
            <InventoryTable />
          </Card>
        </Col>
      </Row>
    </div>
    <div style={{ padding: '20px' }}>
    <Row gutter={[16, 24]}>
      <Col span={12}>
        <Card
          title="Trạng thái đơn hàng"
          style={{
            borderRadius: '12px',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
          }}
          headStyle={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          <OrderStatusPieChart />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="Doanh thu"
          style={{
            borderRadius: '12px',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff',
          }}
          headStyle={{ fontSize: '16px', fontWeight: 'bold' }}
        >
         <RevenueBarChart/>
        </Card>
      </Col>
      </Row>
      </div>
  </div>
);

export default Dashboard;
