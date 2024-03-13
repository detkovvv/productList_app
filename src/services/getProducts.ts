import { type AxiosError } from 'axios';

import { fetching } from './requests';
import { type ProductType } from './types';
import { filterById } from './utils';

type GetProductsProps = (
    signal: AbortSignal,
    page: number,
    productsPerPage: number,
) => Promise<ProductType[]>;

export const getProducts: GetProductsProps = async (
    signal: AbortSignal,
    page: number,
    productsPerPage,
) => {
    const offset = (page - 1) * productsPerPage;
    try {
        const { data } = await fetching(
            'get_ids',
            { offset: offset, limit: productsPerPage },
            signal,
        );

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
