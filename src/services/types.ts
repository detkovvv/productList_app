import { type Dispatch, type SetStateAction } from 'react';

export type ProductType = {
    id: string;
    product: string;
    price: number;
    brand: string | null;
};

export type FiltersPropsType = {
    brands: string[];
    prices: number[];
    names: string[];
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setProducts: Dispatch<SetStateAction<ProductType[]>>;
};
export type SelectedFilterType = {
    [key: string]: string | number | undefined;
};
