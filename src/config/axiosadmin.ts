import axios from 'axios'

const getTokenAdmin = () => {
    return localStorage.getItem('adminToken');
}
const instanceAdmin = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});


instanceAdmin.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = getTokenAdmin()
            ? `Bearer ${getTokenAdmin()}`
            : undefined;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
export default instanceAdmin