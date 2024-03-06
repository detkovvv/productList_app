import axios from 'axios';
import md5 from 'md5';

const password: string = import.meta.env.VITE_PASSWORD;
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

const generateAuthString = (): string => {
    const timestamp: string = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return <string>md5(`${password}_${timestamp}`);
};

const authString = generateAuthString();

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Auth': `${authString}`,
    },
});
