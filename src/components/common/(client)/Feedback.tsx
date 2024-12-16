import React, { useState } from "react";
import { Rate, Input, Button, message, List, Avatar, Switch } from "antd";
import { Star } from "lucide-react";
import { createFeedback } from "../../../services/Feedbacks";

const FeedbackSection = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [classify, setClassify] = useState<boolean>(false); // classify là Boolean
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // Handle feedback submission
  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      message.warning("Vui lòng đánh giá và nhập bình luận.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Bạn cần đăng nhập.");

      const response = await createFeedback(
        productId,
        rating,
        comment,
        classify
      );
      if (response.success) {
        message.success("Gửi phản hồi thành công!");
        setFeedbacks((prev) => [
          ...prev,
          { rating, comment, classify, id: new Date().toISOString() }
        ]);
        console.log("Feedbacks", feedbacks);

        setRating(0);
        setComment("");
        setClassify(false);
      } else {
        message.error(response.message || "Không thể gửi phản hồi.");
      }
    } catch (error: any) {
      message.error(error.message || "Không thể gửi phản hồi.");
    }
  };

  return (
    <div>
      {/* <h2 className="text-lg font-semibold">Đánh giá sản phẩm</h2> */}
      <Rate
        character={<Star />}
        value={rating}
        onChange={setRating}
        allowHalf
      />
      <div style={{ marginTop: "10px" }}>
        <span style={{ marginRight: "10px" }}>Phân loại: </span>
        <Switch
          checked={classify}
          onChange={(checked) => setClassify(checked)}
          checkedChildren="Hiện"
          unCheckedChildren="Ẩn"
        />
      </div>
      <Input.TextArea
        rows={4}
        placeholder="Viết bình luận của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ marginTop: "10px" }}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "10px" }}
      >
        Gửi đánh giá
      </Button>

      {feedbacks && feedbacks.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={feedbacks}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<Star />} />}
                title={
                  <span>
                    Đánh giá: {item.rating}/5 | Phân loại:{" "}
                    {item.classify ? "Hiện" : "Ẩn"}
                  </span>
                }
                description={item.comment}
              />
            </List.Item>
          )}
          style={{ marginTop: "20px" }}
        />
      ) : (
        <p style={{ marginTop: "20px" }}>Chưa có phản hồi nào.</p>
      )}
    </div>
  );
};

export default FeedbackSection;
