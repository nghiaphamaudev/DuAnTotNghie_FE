// // src/components/ImageUploader.tsx
// import React, { useState } from "react";
// import { useAuth } from "../../../../contexts/AuthContext";
// import { uploadImage } from "../../../../services/authServices";


// const ImageUploader: React.FC = () => {
//   const { handleUploadImage, loading } = useAuth();
//   const [image, setImage] = useState<string | null>(null);

//   const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       const file = event.target.files[0];
//       try {
//         const imageUrl = await handleUploadImage(file);
//         setImage(imageUrl); // Cập nhật ảnh sau khi upload

//         // Cập nhật thông tin người dùng nếu cần
//         await uploadImage({ profileImage: imageUrl });
//       } catch (error) {
//         console.error("Lỗi khi upload ảnh hoặc cập nhật thông tin người dùng:", error);
//       }
//     }
//   };

//   return (
//     <label className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center cursor-pointer overflow-hidden">
//       {loading ? (
//         <span className="text-gray-500 text-center text-sm">Uploading...</span>
//       ) : image ? (
//         <img src={image} alt="Preview" className="w-full h-full object-cover" />
//       ) : (
//         <span className="text-gray-500 text-center text-sm">Upload Image</span>
//       )}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="hidden"
//       />
//     </label>
//   );
// };

// export default ImageUploader;
