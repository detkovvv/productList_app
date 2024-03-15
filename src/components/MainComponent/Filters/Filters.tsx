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
    const handleFilterChange = (key: string) => (event: ChangeEvent<HTMLSelectElement>) => {
        const newFilter = event.target.value;

        onChange({ [key]: key === 'price' ? Number(newFilter) : newFilter });
    };

    return (
        <div className={style.filter_container}>
            <label className={style.filter_label}>
                product:
                <select
                    onChange={handleFilterChange('product')}
                    value={selectedFilter['product'] || ''}
                >
                    <option value=''>-</option>
                    {names.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </label>
            <label className={style.filter_label}>
                price:
                <select
                    onChange={handleFilterChange('price')}
                    value={selectedFilter['price'] || ''}
                >
                    <option value=''>-</option>
                    {prices.map((price) => (
                        <option key={price} value={price}>
                            {price}
                        </option>
                    ))}
                </select>
            </label>
            <label className={style.filter_label}>
                brand:
                <select
                    onChange={handleFilterChange('brand')}
                    value={selectedFilter['brand'] || ''}
                >
                    <option value=''>-</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};
