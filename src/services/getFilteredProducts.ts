import { type AxiosError } from 'axios';

import { fetching } from './requests';
import { type ProductType } from './types';
import { filterById } from './utils';

export const getFilteredProducts: (
    signal: AbortSignal,
    params: object,
) => Promise<ProductType[]> = async (signal: AbortSignal, params: object) => {
    try {
        const { data } = await fetching('filter', params, signal);

        const itemsResponse = await fetching(
            'get_items',
            {
                ids: data.result,
            },
            signal,
        );

        return filterById(itemsResponse.data.result);
    } catch (axiosError) {
        const error = axiosError as AxiosError;
        if (error.name === 'AbortError') {
            console.log('Request aborted', error.message);
        } else {
            console.error('Error fetching data:', error);
        }
        return [];
    }
};
