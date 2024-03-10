import { type AxiosError } from 'axios';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';

import style from './Filter.module.css';
import { fetching } from '../../../services/requests';
import {
    type FiltersPropsType,
    type ProductType,
    type SelectedFilterType,
} from '../../../services/types';

export const Filters: FC<FiltersPropsType> = ({
    brands,
    prices,
    names,
    setIsLoading,
    setProducts,
}) => {
    const [selectedFilter, setSelectedFilter] = useState<SelectedFilterType>({});

    const getFilteredProducts = async (signal: AbortSignal, params: object) => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };
    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>, key: string) => {
        const newFilter = event.target.value;
        if (key === 'price') {
            setSelectedFilter({ [key]: Number(newFilter) });
        } else {
            setSelectedFilter({ [key]: newFilter });
        }
    };
    useEffect(() => {
        const abortController = new AbortController();
        getFilteredProducts(abortController.signal, selectedFilter);
        return () => {
            abortController.abort();
        };
    }, [selectedFilter]);

    return (
        <div className={style.filter_container}>
            <label>
                Name:
                <select
                    onChange={(event) => handleFilterChange(event, 'product')}
                    value={selectedFilter['product'] || ''}
                >
                    <option value=''>-</option>
                    {names.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Price:
                <select
                    onChange={(event) => handleFilterChange(event, 'price')}
                    value={selectedFilter['price'] || ''}
                >
                    <option value=''>-</option>
                    {prices.map((price, index) => (
                        <option key={index} value={price}>
                            {price}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Brand:
                <select
                    onChange={(event) => handleFilterChange(event, 'brand')}
                    value={selectedFilter['brand'] || ''}
                >
                    <option value=''>-</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};
