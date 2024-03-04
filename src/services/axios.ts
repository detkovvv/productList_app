import axios from 'axios';
import md5 from 'md5';

const password: string = 'Valantis';
export const API_BASE_URL = 'https://api.valantis.store:41000/';

export const axiosInstance = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
        'X-Auth': `${authString}`,
    },
});

const authString = generateAuthString();

const generateAuthString = (): string => {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return md5(`${password}_${timestamp}`);
};
