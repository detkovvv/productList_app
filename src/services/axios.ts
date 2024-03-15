import axiosLib from 'axios';
import md5 from 'md5';

const PASSWORD = import.meta.env.VITE_PASSWORD;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const generateAuthString = () => {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return <string>md5(`${PASSWORD}_${timestamp}`);
};

export const axiosInstance = axiosLib.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Auth': generateAuthString(),
    },
});
