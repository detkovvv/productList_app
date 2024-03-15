import { fetchData } from './fetchWrapper';
import { fetching } from './requests';
import { type FieldsData } from './types';

export type GetFieldsType = (...args: FieldsRequestArgs) => Promise<FieldsData>;

export type FieldsResponse = {
    brands: string[];
    prices: number[];
    products: string[];
};

export type FieldsRequestArgs = [signal: AbortSignal, page: number, productsPerPage: number];

export const getFields: GetFieldsType = async (signal, page, productsPerPage) => {
    const offset = (page - 1) * productsPerPage;
    const fieldNames = ['brand', 'price', 'product'];

    const fieldsData = await fetchData(async () => {
        return Promise.allSettled(
            fieldNames.map((field) =>
                fetching('get_fields', { field, offset, limit: productsPerPage }, signal),
            ),
        );
    });

    const [brands, prices, products] = fieldsData.map((item) => {
        return item.status === 'fulfilled' ? [...new Set(item.value.data.result)] : [];
    });

    return <FieldsResponse>{ brands, prices, products };
};
