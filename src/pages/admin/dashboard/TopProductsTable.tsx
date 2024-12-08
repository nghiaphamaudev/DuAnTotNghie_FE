import  { useEffect, useState } from 'react';
import { Table, Typography, Spin, message, Select, DatePicker, Space, Button } from 'antd';
import dayjs from 'dayjs';
import { getTopProducts } from '../../../services/servicesdashboard/topProduct';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TopProductsTable = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year' | 'range'>('day'); // Mặc định là 'day'
    const [dateRange, setDateRange] = useState<[dayjs, dayjs] | []>([]);

    useEffect(() => {
        fetchTopProducts(timeRange);
    }, [timeRange]);

    const fetchTopProducts = async (range: 'day' | 'week' | 'month' | 'year' | 'range', start?: string, end?: string) => {
        setLoading(true);
        try {
            const result = await getTopProducts(range, start, end);
            setData(result);
        } catch (error) {
            message.error('Không thể tải dữ liệu sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    const handleRangeChange = (value: 'day' | 'week' | 'month' | 'year' | 'range') => {
        setTimeRange(value);
        if (value !== 'range') setDateRange([]); // Xóa ngày khi không dùng khoảng thời gian tùy chọn
    };

    const handleDateChange = (dates: [dayjs, dayjs] | null) => {
        if (dates) {
            setDateRange(dates);
        }
    };

    const handleFilter = () => {
        if (timeRange === 'range' && dateRange.length === 2) {
            const startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
            const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
            fetchTopProducts('range', startDate, endDate);
        }
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: ['productInfo', 'name'],
            key: 'name',
        },
        {
            title: 'Số lượng bán',
            dataIndex: 'totalSold',
            key: 'totalSold',
        },
        {
            title: 'Tổng doanh thu',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (value: number | undefined) =>
                `${(value || 0).toLocaleString()} VND` // Định dạng số
        },
    ];

    return (
        <div>
            <Title level={4} style={{ marginBottom: '20px' }}>
                Thống Kê Sản Phẩm Bán Chạy Theo Khoảng Thời Gian
            </Title>
            <Space style={{ marginBottom: '20px' }}>
                <Select value={timeRange} onChange={handleRangeChange} style={{ width: 150 }}>
                    <Option value="day">Hôm nay</Option>
                    <Option value="week">Tuần này</Option>
                    <Option value="month">Tháng này</Option>
                    <Option value="year">Năm nay</Option>    
                </Select>
                {timeRange === 'range' && (
                    <RangePicker onChange={handleDateChange} style={{ width: 300 }} />
                )}
                {timeRange === 'range' && (
                    <Button type="primary" onClick={handleFilter}>
                        Lọc
                    </Button>
                )}
            </Space>
            {loading ? (
                <Spin size="large" style={{ display: 'block', margin: 'auto' }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 3, showSizeChanger: false }}
                    bordered
                />
            )}
        </div>
    );
};

export default TopProductsTable;
