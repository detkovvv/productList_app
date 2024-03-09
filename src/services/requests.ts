import { axiosInstance } from './axios';

export const fetching = (action: string, params: object, signal: AbortSignal) =>
    axiosInstance.post(
        '/',
        {
            action: action,
            params: params,
        },
        { signal },
    );
