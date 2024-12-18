import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  message,
  Select,
  DatePicker,
  Space,
  Button
} from "antd";
import dayjs from "dayjs";
import { getTopProducts } from "../../../services/servicesdashboard/topProduct";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TopProductsTable = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState<
    "day" | "week" | "month" | "year" | "range"
  >("day"); // Mặc định là 'day'
  const [dateRange, setDateRange] = useState<[dayjs, dayjs] | []>([]);

  useEffect(() => {
    fetchTopProducts(timeRange);
  }, [timeRange]);

  const fetchTopProducts = async (
    range: "day" | "week" | "month" | "year" | "range",
    start?: string,
    end?: string
  ) => {
    setLoading(true);
    try {
      const result = await getTopProducts(range, start, end);
      setData(result);
    } catch (error) {
      message.error("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (
    value: "day" | "week" | "month" | "year" | "range"
  ) => {
    setTimeRange(value);
    if (value !== "range") setDateRange([]); // Xóa ngày khi không dùng khoảng thời gian tùy chọn
  };

  const handleDateChange = (dates: [dayjs, dayjs] | null) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleFilter = () => {
    if (timeRange === "range" && dateRange.length === 2) {
      const startDate = dayjs(dateRange[0]).toISOString();
      const endDate = dayjs(dateRange[1]).toISOString();
      fetchTopProducts("range", startDate, endDate);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: ["productInfo", "name"],
      key: "name"
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: ["productInfo", "coverImg"],
      align: "center",
      render: (src: string) => (
        <div className="image-container">
          <img src={src} alt="product" style={{ width: 100 }} />
        </div>
      )
    },
    {
      title: "Số lượng bán",
      align: "center",
      dataIndex: "totalSold",
      key: "totalSold"
    },
    {
      title: "Doanh thu dự kiến",
      align: "center",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value: number | undefined) =>
        `${(value || 0).toLocaleString()} VND`
    }
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: "20px" }}>
        Thống Kê Top 3 Sản Phẩm Bán Chạy
      </Title>
      <Space style={{ marginBottom: "20px" }}>
        <Select
          value={timeRange}
          onChange={handleRangeChange}
          style={{ width: 150 }}
        >
          <Option value="day">Hôm nay</Option>
          <Option value="week">Tuần này</Option>
          <Option value="month">Tháng này</Option>
          <Option value="year">Năm nay</Option>
          <Select.Option value="range">Tùy Chọn</Select.Option>
        </Select>
        {timeRange === "range" && (
          <RangePicker onChange={handleDateChange} style={{ width: 300 }} />
        )}
        {timeRange === "range" && (
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        )}
      </Space>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          bordered
        />
      )}
    </div>
  );
};

export default TopProductsTable;
