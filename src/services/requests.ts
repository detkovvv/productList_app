import { axiosInstance } from './axios';

export const response = (action, params, signal) =>
    axiosInstance.post(
        '/',
        {
            action: action,
            params: params,
        },
        { signal },
    );
