import { type AxiosError } from 'axios';

import { fetching } from './requests';
import { type ProductType } from './types';

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
