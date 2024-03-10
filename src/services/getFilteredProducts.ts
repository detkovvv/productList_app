import { type AxiosError } from 'axios';
import { type Dispatch, type SetStateAction } from 'react';

import { fetching } from './requests';
import { type ProductType } from './types';

export const getFilteredProducts: (
    signal: AbortSignal,
    params: object,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setProducts: Dispatch<SetStateAction<ProductType[]>>,
) => Promise<void> = async (signal: AbortSignal, params: object, setIsLoading, setProducts) => {
    setIsLoading(true);
    try {
        const idsResponse = await fetching('filter', params, signal);
        const ids = idsResponse.data.result;
        const itemsResponse = await fetching(
            'get_items',
            {
                ids: ids,
            },
            signal,
        );

        const uniqIds = new Set();
        const filteredResponse = itemsResponse.data.result.filter((item: ProductType) => {
            if (uniqIds.has(item.id)) return false;
            else {
                uniqIds.add(item.id);
                return true;
            }
        });
        setProducts(filteredResponse);
    } catch (axiosError) {
        const error = axiosError as AxiosError;
        if (error.name === 'AbortError') {
            console.log('Request aborted', error.message);
        } else {
            console.error('Error fetching data:', error);
        }
    } finally {
        setIsLoading(false);
    }
};
