import axios from 'axios'

const getToken = () => {
    return localStorage.getItem('accessToken');
}
const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});


instance.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = getToken()
            ? `Bearer ${getToken()}`
            : undefined;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
export default instance