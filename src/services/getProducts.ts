import { fetchData } from './fetchWrapper';
import { fetching } from './requests';
import { type ProductType } from './types';
import { filterById } from './utils';

export type GetProductsType = (...args: ProductsRequestArgs) => Promise<ProductType[]>;

export type ProductsRequestArgs = [signal: AbortSignal, page: number, productsPerPage: number];

export const getProducts: GetProductsType = async (signal, page, productsPerPage) => {
    const offset = (page - 1) * productsPerPage;

    const { data } = await fetchData(async () => {
        return fetching('get_ids', { offset, limit: productsPerPage }, signal);
    });

    const itemsResponse = await fetchData(async () => {
        return fetching('get_items', { ids: data.result }, signal);
    });
    return filterById(itemsResponse.data.result);
};
