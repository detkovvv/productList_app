import { type FC } from 'react';

import style from './Filter.module.css';

type FilterPropsType = {
    brands: string[];
    prices: number[];
    names: string[];
    handleBrandChange: () => void;
    selectedBrand: string;
    handlePriceChange: () => void;
    selectedPrice: string;
    handleNameChange: () => void;
    selectedName: string;
};
export const Filter: FC<FilterPropsType> = ({
    brands,
    prices,
    names,
    handleBrandChange,
    selectedBrand,
    handlePriceChange,
    selectedPrice,
    handleNameChange,
    selectedName,
}) => {
    return (
        <div className={style.filter_container}>
            <label>
                Brand:
                <select onChange={handleBrandChange} value={selectedBrand}>
                    <option value=''>All</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Price:
                <select onChange={handlePriceChange} value={selectedPrice}>
                    <option value=''>All</option>
                    {prices.map((price, index) => (
                        <option key={index} value={price}>
                            {price}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Name:
                <select onChange={handleNameChange} value={selectedName}>
                    <option value=''>All</option>
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
