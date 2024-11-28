import axios from "axios";

export const checkVoucherCode = async (code: string) => {
    try {
        const response = await axios.get(`/api/vouchers/check-code?code=${code}`);
        return response.data.exists;
    } catch (error) {
        console.error("Failed to check voucher code:", error);
        return false;
    }
};
