import axios from "axios";

export const updateFeedback = async (feedbackId: any, updatedData: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return { success: false, message: 'Token không tồn tại. Vui lòng đăng nhập lại.' };
    }

    try {
        const response = await axios.patch(
            `http://127.0.0.1:8000/api/v1/feedback/${feedbackId}`,
            {
                rating: updatedData.rating,
                comment: updatedData.comment,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: 'Không thể sửa bình luận.' };
        }
    } catch (error) {
        // Xử lý lỗi chi tiết
        const errorMessage =
            error.response?.data?.message || 'Lỗi không xác định từ server.';
        return { success: false, message: errorMessage };
    }
};

export const deleteFeedback = async (feedbackId: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return { success: false, message: "Bạn cần đăng nhập để thực hiện thao tác này." };
    }

    try {
        const response = await axios.delete(
            `http://127.0.0.1:8000/api/v1/feedback/${feedbackId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return { success: true, message: "Bình luận đã được xóa." };
        } else {
            return { success: false, message: "Không thể xóa bình luận." };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Lỗi không xác định từ server.",
        };
    }
};

export const toggleLikeFeedback = async (feedbackId: any, token: any) => {
    const url = `http://127.0.0.1:8000/api/v1/feedback/${feedbackId}/like`;

    try {
        const response = await axios.patch(
            url,
            {}, // Không cần gửi body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi API toggle like:", error.response || error.message);
        throw error;
    }
};

