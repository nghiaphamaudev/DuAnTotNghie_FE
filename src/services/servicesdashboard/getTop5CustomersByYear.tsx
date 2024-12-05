import instance from '../../config/axios';
type TimeRange = 'day' | 'week' | 'month' | 'year' | 'range';

interface UserInfo {
    email: string;
    fullName: string;
    phoneNumber: string;
}

interface CustomerData {
    _id: string;
    totalAmount: number;
    userInfo: UserInfo;
}
export const getTopCustomers = async (
    timeRange: TimeRange,
    startDate?: string,
    endDate?: string
): Promise<CustomerData[]> => {
    try {
        let url = `/statements/top-customers/${timeRange}`;
        if (timeRange === 'range' && startDate && endDate) {
            url += `?start=${startDate}&end=${endDate}`;
        }

        const response = await instance.get(url);
        return response.data.data; 
    } catch (error) {
        console.error(`Failed to fetch top customers for ${timeRange}:`, error);
        throw error;
    }
};
