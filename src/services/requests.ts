import { axiosInstance } from './axios';

export const fetching = (action, params, signal) =>
    axiosInstance.post(
        '/',
        {
            action: action,
            params: params,
        },
        { signal },
    );
