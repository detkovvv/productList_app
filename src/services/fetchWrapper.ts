import { type AxiosError, type AxiosResponse } from 'axios';

type FetchFunction<T> = () => Promise<AxiosResponse<T>>;

type FetchFunctionArgs<T> = Parameters<FetchFunction<T>>;

type HandleFetchError = <T>(
    axiosError: AxiosError,
    fetchFunction: FetchFunction<T>,
    ...args: FetchFunctionArgs<T>
) => Promise<T | []>;

type FetchData = <T>(
    fetchFunction: FetchFunction<T>,
    ...args: FetchFunctionArgs<T>
) => Promise<T | []>;

export const handleFetchError: HandleFetchError = async (axiosError, fetchFunction, ...args) => {
    if (axiosError.name === 'AbortError') {
        console.log('Request aborted', axiosError.message);
    } else {
        console.error('Error fetching data:', axiosError);
        try {
            return await fetchFunction(...args);
        } catch (error) {
            console.error('Error retrying fetch:', error);
            return [];
        }
    }
    return [];
};

export const fetchData: FetchData = async (fetchFunction, ...args) => {
    try {
        return await fetchFunction(...args);
    } catch (axiosError) {
        return handleFetchError(axiosError, fetchFunction, ...args);
    }
};
