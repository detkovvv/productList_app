import { type AxiosError } from 'axios';
import { type FC, useEffect, useState } from 'react';
import { Simulate } from 'react-dom/test-utils';

import style from './Filter.module.css';
import { fetching } from '../../../services/requests';
import { type ProductType } from '../../../services/types';

import input = Simulate.input;

type FiltersPropsType = {
    brands: string[];
    prices: number[];
    names: string[];
    setIsLoading: boolean;
    setProducts: (value: ((prevState: boolean) => boolean) | boolean) => void;
};
export const Filters: FC<FiltersPropsType> = ({
    brands,
    prices,
    names,
    setIsLoading,
    setProducts,
}) => {
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    const getFilteredProducts = async (signal: AbortSignal, params: string) => {
        // setIsLoading(true);
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
            // отбор уникальных продуктов
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
        } /* finally {
            setIsLoading(false);
        }*/
    };
    const handleFilterChange = (event) => {
        const newFilter = event.target.value;
        setSelectedFilter(newFilter);
        // Выполнение запроса с новым фильтром
    };
    useEffect(() => {
        const abortController = new AbortController();
        getFilteredProducts(abortController.signal, selectedFilter);
        return () => {
            abortController.abort();
        };
    }, [input]);

    return (
        <div className={style.filter_container}>
            <label>
                Brand:
                <select value={selectedFilter}>
                    <option value=''>-</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Price:
                <select onChange={handleFilterChange} value={selectedFilter}>
                    <option value=''>-</option>
                    {prices.map((price, index) => (
                        <option key={index} value={price}>
                            {price}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Name:
                <select onChange={handleFilterChange} value={selectedFilter}>
                    <option value=''>-</option>
                    {names.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};
