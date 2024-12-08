import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, Button, Input, Space, Typography, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getRevenueProducts } from '../../../services/servicesdashboard/revenueProduct';

const { Title } = Typography;
type TimeRange = 'day' | 'week' | 'month' | 'year' | 'range';

const RevenueBarChart = () => {
    const [data, setData] = useState<{ date: string; revenue: number }[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>('day');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getRevenueProducts(timeRange, startDate, endDate);
            setData(result);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [timeRange, startDate, endDate]);

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Title level={4}>Thống Kê Doanh Thu</Title>
            {/* Bộ lọc */}
            <Space style={{ marginBottom: '16px' }}>
                <Select
                    value={timeRange}
                    onChange={(value) => setTimeRange(value as TimeRange)}
                    style={{ width: 150 }}
                >
                    <Select.Option value="day">Hôm Nay</Select.Option>
                    <Select.Option value="week">Tuần Này</Select.Option>
                    <Select.Option value="month">Tháng Này</Select.Option>
                    <Select.Option value="year">Năm Này</Select.Option>
                    <Select.Option value="range">Tùy Chọn</Select.Option>
                </Select>
                {timeRange === 'range' && (
                    <Space>
                        <Input
                            type="date"
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                        />
                        <Input
                            type="date"
                            onChange={(e) => setEndDate(e.target.value)}
                            value={endDate}
                        />
                        <Button type="primary" onClick={fetchData}>
                            Lọc
                        </Button>
                    </Space>
                )}
            </Space>

            {/* Biểu đồ */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                            <Bar dataKey="totalRevenue" fill="#82ca9d" />
                            <Bar dataKey="totalRefund" fill="#0088FE" />
                            <Bar dataKey="totalRealRevenue" fill="#00C49F" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Không có dữ liệu</p>
                </div>
            )}
        </div>
    );
};

export default RevenueBarChart;