import instance from '../../config/axios';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'range';

interface StatusData {
    status: string;
    percentage: string; 
}
export const getOrderStatuses = async (
    timeRange: TimeRange,
    startDate?: string,
    endDate?: string
): Promise<StatusData[]> => {
    try {
        let url = `/statements/order-status-ratio/${timeRange}`;
        if (timeRange === 'range' && startDate && endDate) {
            url += `?start=${startDate}&end=${endDate}`;
        }

        const response = await instance.get(url);
        return response.data.data;
    } catch (error) {
        console.error(`Failed to fetch order statuses for ${timeRange}:`, error);
        throw error;
    }
};
