import { type AxiosError } from 'axios';

import { fetching } from './requests';
import { type ProductType } from './types';

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

        const uniqIds = new Set();

        return itemsResponse.data.result.filter((item: ProductType) => {
            if (uniqIds.has(item.id)) return false;
            else {
                uniqIds.add(item.id);
                return true;
            }
        });
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
