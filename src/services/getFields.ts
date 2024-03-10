import { type AxiosError } from 'axios';
import { type Dispatch, type SetStateAction } from 'react';

import { fetching } from './requests';

export const getFields: (
    signal: AbortSignal,
    page: number,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    productsPerPage: number,
    setBrands: Dispatch<SetStateAction<string[]>>,
    setPrices: Dispatch<SetStateAction<number[]>>,
    setNames: Dispatch<SetStateAction<string[]>>,
) => Promise<void> = async (
    signal,
    page,
    setIsLoading,
    productsPerPage,
    setBrands,
    setPrices,
    setNames,
) => {
    setIsLoading(true);
    const offset = (page - 1) * productsPerPage;
    try {
        const fieldNames = ['brand', 'price', 'product'];

        const fieldsData = await Promise.all(
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
        const [brandsData, pricesData, namesData] = fieldsData;
        setBrands(brandsData.filter((item: string | null) => item !== null));
        setPrices(pricesData.filter((item: string | null) => item !== null));
        setNames(namesData.filter((item: string | null) => item !== null));
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
