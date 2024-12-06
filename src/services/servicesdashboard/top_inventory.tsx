import instance from '../../config/axios';
type TimeRange = 'day' | 'week' | 'month' | 'year' | 'range';
interface CustomerData {
    _id: string;
    totalAmount: number;
}
export const getTopEvenTory = async (
    timeRange: TimeRange,
    startDate?: string,
    endDate?: string
): Promise<CustomerData[]> => {
    try {
        let url = `/statements/top-products-inventory/${timeRange}`;
        if (timeRange === 'range' && startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await instance.get(url);
        return response.data.data;
    } catch (error) {
        console.error(`Failed to fetch top customers for ${timeRange}:`, error);
        throw error;
    }
};
