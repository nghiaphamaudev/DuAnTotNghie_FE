/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { getOrderStatuses } from '../../../services/servicesdashboard/OrderStatusTable';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Select, Space, Input, Typography, Spin } from 'antd';
// import './OrderStatusPieChart.css'; // Thêm tệp CSS để làm đẹp

const { Title } = Typography;

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'range';

const OrderStatusPieChart = () => {
    const [data, setData] = useState<any[]>([]); // Dữ liệu cho biểu đồ tròn
    const [timeRange, setTimeRange] = useState<TimeRange>('day'); // Thời gian mặc định là 'day'
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();

    // Hàm gọi API và cập nhật dữ liệu cho biểu đồ
    const fetchData = async (timeRange: TimeRange, startDate?: string, endDate?: string) => {
        setLoading(true);
        try {
            const result = await getOrderStatuses(timeRange, startDate, endDate);
            const chartData = result.map(item => ({
                name: item.status,
                value: parseFloat(item.percentage),
            }));
            setData(chartData);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu trạng thái đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi hàm fetchData khi thay đổi thời gian
    useEffect(() => {
        fetchData(timeRange, startDate, endDate);
    }, [timeRange, startDate, endDate]);

    // Màu sắc cho các phân đoạn của biểu đồ tròn
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666', '#8E44AD', '#3498DB', '#2ECC71'];

    return (
        <div className="chart-container">
            <Title level={4}>Thống Kê Trạng Thái Đơn Hàng</Title>

            {/* Phần lọc thời gian */}
            <Space className="filter-space">
                <Select
                    value={timeRange}
                    onChange={(value) => setTimeRange(value as TimeRange)}
                    style={{ width: 150 }}
                    className="time-select"
                >
                    <Select.Option value="day">Hôm Nay</Select.Option>
                    <Select.Option value="week">Tuần Này</Select.Option>
                    <Select.Option value="month">Tháng Này</Select.Option>
                    <Select.Option value="year">Năm Nay</Select.Option>
                </Select>
                {timeRange === 'range' && (
                    <Space>
                        <Input
                            type="date"
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                            className="date-picker"
                        />
                        <Input
                            type="date"
                            onChange={(e) => setEndDate(e.target.value)}
                            value={endDate}
                            className="date-picker"
                        />
                        <Button
                            type="primary"
                            onClick={() => fetchData('range', startDate, endDate)}
                            className="filter-button"
                        >
                            Lọc
                        </Button>
                    </Space>
                )}
            </Space>

            {/* Hiển thị biểu đồ hoặc thông báo nếu không có dữ liệu */}
            {loading ? (
                <div className="loading-container">
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : data.length > 0 ? (
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                    >
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <p>Không có dữ liệu</p>
                        </div>
            )}
        </div>
    );
};

export default OrderStatusPieChart;
