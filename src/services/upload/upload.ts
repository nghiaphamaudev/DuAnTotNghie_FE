import axios from "axios";

export const uploadImage = async (images: File[]) => {
    if (images && images.length > 0) {
        try {
            const CLOUD_NAME = "desgvkdyj";
            const PRESET_NAME = "product-img";
            const FOLDER_NAME = "img-products";
            const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    
            const uploadedImageUrls: string[] = [];
    
            for (const image of images) {
                const formData = new FormData();
                formData.append("upload_preset", PRESET_NAME);
                formData.append("folder", FOLDER_NAME);
                formData.append("file", image);
    
                const response = await axios.post(api, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                uploadedImageUrls.push(response.data.secure_url);
            }
    
            return uploadedImageUrls;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    }
    return [];
}