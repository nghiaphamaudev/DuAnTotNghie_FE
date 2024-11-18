import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
 // Nhập hook sử dụng context

interface ImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void; // Callback khi upload thành công
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const { handleUploadImage } = useAuth(); // Sử dụng context để lấy hàm upload ảnh
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setLoading(true); // Bắt đầu tải lên
      try {
        const response = await handleUploadImage(file); // Gọi hàm upload ảnh từ context
        const imageUrl = response.data?.imageUrl; // Giả sử API trả về URL của ảnh
        setImage(imageUrl); // Cập nhật ảnh
        if (onUploadSuccess) {
          onUploadSuccess(imageUrl); // Gọi callback nếu có
        }
      } catch (error) {
        console.error("Upload ảnh thất bại:", error);
      } finally {
        setLoading(false); // Kết thúc quá trình tải lên
      }
    }
  };

  return (
    <label className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center cursor-pointer overflow-hidden">
      {loading ? (
        <span className="text-gray-500 text-center text-sm">Uploading...</span>
      ) : image ? (
        <img src={image} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-500 text-center text-sm">Upload Image</span>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </label>
  );
};

export default ImageUploader;
