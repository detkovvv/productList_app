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
            fieldNames.map((field) =>
                fetching('get_fields', { field, offset, limit: productsPerPage }, signal),
            ),
        );

        const [brands, prices, products] = fieldsData.map((item) => {
            return item.status === 'fulfilled' ? item.value.data.result : [];
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
