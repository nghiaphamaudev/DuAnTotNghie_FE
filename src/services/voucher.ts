/* eslint-disable @typescript-eslint/no-explicit-any */

import instance from '../config/axios';
import { IVoucher } from '../interface/Voucher';

export const addVoucher = async (voucher: IVoucher) => {
    return instance.post('/vouchers', voucher);
};
export const fetchVouchers = async () => {
    try {
        const response = await instance.get('/vouchers');
        return response.data.data; // Assuming the response structure has a 'data' property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        throw new Error("Error fetching vouchers: " + error.message);
    }
};
export const updateVoucherStatus = async (id: string, status: string): Promise<any> => {
    const response = await instance.patch(`/vouchers/${id}`, { status });
    return response.data;   
};