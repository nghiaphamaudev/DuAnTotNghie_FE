import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, Button, Input, Space, Typography, Spin, message } from 'antd';
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

    const fetchData = async (_p0: string, startDate: string, endDate: string) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRange, startDate, endDate]);
    const handleFilter = () => {
        if (timeRange === 'range') {
            if (!startDate || !endDate) {
                message.error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.');
                return;
            }

            if (new Date(endDate) < new Date(startDate)) {
                message.error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
                return;
            }

            fetchData('range', startDate, endDate);
        }
    };
    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
            <Title level={4}>Thống Kê Doanh Thu</Title>
            {/* Bộ lọc */}
            <Space >
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
                        <Button
                            type="primary"
                            onClick={handleFilter}
                            className="filter-button"
                        >
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
                <ResponsiveContainer width="100%" height={382} style={{marginTop:'18px'}}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                            <Bar dataKey="totalRevenue" name="Tổng Doanh Thu" fill="#82ca9d" />
                            <Bar dataKey="totalRefund" name="Hoàn Tiền" fill="#0088FE" />
                            <Bar dataKey="totalRealRevenue" name="Doanh Thu Thực" fill="#00C49F" />
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