import { fetching } from './requests';
import { type ProductType } from './types';
import { fetchData, filterById } from './utils';

export type GetFilteredProductsType = (
    ...args: FilteredProductsRequestArgs
) => Promise<ProductType[]>;

export type FilteredProductsRequestArgs = [signal: AbortSignal, params: object];

export const getFilteredProducts: GetFilteredProductsType = async (signal, params) => {
    const { data } = await fetchData(async () => {
        return fetching('filter', params, signal);
    });

    const itemsResponse = await fetchData(async () => {
        return fetching('get_items', { ids: data.result }, signal);
    });

    return filterById(itemsResponse.data.result);
};
