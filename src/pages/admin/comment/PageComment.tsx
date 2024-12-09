import { Card, Col, Row, Select, Table, Switch, Radio } from "antd";
import BreadcrumbsCustom from "../../../components/common/(admin)/BreadcrumbsCustom";
import { useState, useEffect } from "react";
import axios from "axios";
import { deleteFeedback, deleteFeedbackStatus } from "../../../services/Feedbacks";

const customTableHeaderCellStyle: React.CSSProperties = {
  color: "black",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

// Define the type for Table Header Cell Props
type CustomTableHeaderCellProps = React.ComponentProps<"th">;

const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

export default function PageComment() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);

  // Call API to fetch feedbacks
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/feedback");
      setFeedbacks(response.data.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);



  const handleStatusChange = async (checked: boolean, id: string) => {
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.id === id ? { ...feedback, classify: checked } : feedback
      )
    );

    try {
      const FeedbackData = await deleteFeedbackStatus(id, checked);
      if (FeedbackData && FeedbackData.data) {
        const { data } = FeedbackData;
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) =>
            feedback.id === data.id ? { ...feedback, classify: data.classify } : feedback
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((feedback) =>
          feedback.id === id ? { ...feedback, classify: !checked } : feedback
        )
      );
    }
  };







  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "stt",
      align: "center" as const,
      render: (text: any, record: any, index: number) => index + 1,
      width: "5%",
    },
    {
      title: "Tên tài khoản",
      dataIndex: ["user", "fullName"],
      key: "fullName",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["productId", "name"],
      key: "productName",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: ["productId", "coverImg"],
      key: "coverImg",
      align: "center" as const,
      width: "10%",
      render: (imageUrl: string) => (
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          <span>Không có ảnh</span>
        )
      ),
    },

    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      align: "center" as const,
      width: "30%",
    },
    {
      title: "Trạng thái",
      dataIndex: "classify",
      key: "classify",
      align: "center",
      width: "10%",
      render: (classify: boolean, record: any) => (
        <Switch
          checked={classify}
          checkedChildren=""
          unCheckedChildren=""
          onChange={(checked) => handleStatusChange(checked, record.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Bình luận"} />
      <Card bordered={false}>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={5}>
            <span>Sản phẩm: </span>
            <Select style={{ width: "100%" }} value={1}>
              <Select.Option value={null}>Tất cả</Select.Option>
            </Select>
          </Col>
          <Col span={5}>
            <span>Khách hàng: </span>
            <Select style={{ width: "100%" }} value={1}>
              <Select.Option value={null}>Tất cả</Select.Option>
              <Select.Option value={1}>User 1</Select.Option>
            </Select>
          </Col>
          <Col span={14}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              value={statusFilter}
            >
              <Radio value={null}>Tất cả</Radio>
              <Radio value="1">Hoạt động</Radio>
              <Radio value="0">Ngừng hoạt động</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: CustomHeaderCell,
            },
          }}
          columns={columns}
          dataSource={feedbacks}
          loading={loading}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
