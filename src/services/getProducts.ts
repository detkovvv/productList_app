import { type AxiosError } from 'axios';
import { type Dispatch, type SetStateAction } from 'react';

import { fetching } from './requests';
import { type ProductType } from './types';

export const getProducts: (
    signal: AbortSignal,
    page: number,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    productsPerPage: number,
    setProducts: Dispatch<SetStateAction<ProductType[]>>,
    setIsFirstPage: Dispatch<SetStateAction<boolean>>,
    setIsLastPage: Dispatch<SetStateAction<boolean>>,
) => Promise<void> = async (
    signal: AbortSignal,
    page: number,
    setIsLoading,
    productsPerPage,
    setProducts,
    setIsFirstPage,
    setIsLastPage,
) => {
    setIsLoading(true);
    const offset = (page - 1) * productsPerPage;
    try {
        const idsResponse = await fetching(
            'get_ids',
            { offset: offset, limit: productsPerPage },
            signal,
        );
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
        setIsFirstPage(page === 1);
        setIsLastPage(filteredResponse.length < productsPerPage - 5);
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
