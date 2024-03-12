import { type ChangeEvent, type FC } from 'react';

import style from './Filter.module.css';
import { type FiltersPropsType } from '../../../services/types';

export const Filters: FC<FiltersPropsType> = ({
    brands,
    prices,
    names,
    selectedFilter,
    onChange,
}) => {
    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>, key: string) => {
        const newFilter = event.target.value;
        if (key === 'price') {
            onChange({ [key]: Number(newFilter) });
        } else {
            onChange({ [key]: newFilter });
        }
    };

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
