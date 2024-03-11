import { type ChangeEvent, type FC, useEffect, useState } from 'react';

import style from './Filter.module.css';
import { getFilteredProducts } from '../../../services/getFilteredProducts';
import { type FiltersPropsType, type SelectedFilterType } from '../../../services/types';

export const Filters: FC<FiltersPropsType> = ({
    brands,
    prices,
    names,
    setIsLoading,
    setProducts,
}) => {
    const [selectedFilter, setSelectedFilter] = useState<SelectedFilterType>({});

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>, key: string) => {
        const newFilter = event.target.value;
        if (key === 'price') {
            setSelectedFilter({ [key]: Number(newFilter) });
        } else {
            setSelectedFilter({ [key]: newFilter });
        }
    };
    useEffect(() => {
        setIsLoading(true);
        const abortController = new AbortController();
        getFilteredProducts(abortController.signal, selectedFilter)
            .then((result) => setProducts(result))
            .finally(() => setIsLoading(false));
        return () => {
            abortController.abort();
        };
    }, [selectedFilter]);

    return (
        <div className={style.filter_container}>
            <label className={style.filter_label}>
                product:
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
            <label className={style.filter_label}>
                price:
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
            <label className={style.filter_label}>
                brand:
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
