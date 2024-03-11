import { type AxiosError } from 'axios';

import { fetching } from './requests';
import { type FieldsData } from './types';

type GetFieldsProps = (
    signal: AbortSignal,
    page: number,
    productsPerPage: number,
) => Promise<FieldsData>;

export const getFields: GetFieldsProps = async (signal, page, productsPerPage) => {
    const offset = (page - 1) * productsPerPage;
    try {
        const fieldNames = ['brand', 'price', 'product'];

        const fieldsData = await Promise.allSettled(
            fieldNames.map(async (field) => {
                const fieldResponse = await fetching(
                    'get_fields',
                    {
                        field: field,
                        offset: offset,
                        limit: productsPerPage,
                    },
                    signal,
                );
                return fieldResponse.data.result;
            }),
        );
        const brands: FieldsData['brands'] = [];
        const prices: FieldsData['prices'] = [];
        const products: FieldsData['products'] = [];
        fieldsData.forEach((fieldData, index) => {
            if (fieldData.status === 'fulfilled') {
                const data = fieldData.value;
                switch (index) {
                    case 0:
                        brands.push(...data);
                        break;
                    case 1:
                        prices.push(...data);
                        break;
                    case 2:
                        products.push(...data);
                        break;
                }
            }
        });

        return { brands, prices, products };
    } catch (axiosError) {
        const error = axiosError as AxiosError;
        if (error.name === 'AbortError') {
            console.log('Request aborted', error.message);
        } else {
            console.error('Error fetching data:', error);
        }
        return { brands: [], prices: [], products: [] };
    }
};
