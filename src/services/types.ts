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
    selectedFilter: SelectedFilterType;
    onChange: (value: SelectedFilterType) => void;
};
export type SelectedFilterType = {
    [key: string]: string | number | undefined;
};

export type FieldsData = {
    brands: string[];
    prices: number[];
    products: string[];
};
