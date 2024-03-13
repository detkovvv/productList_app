import { type ProductType } from './types';

export const filterById = (data) => {
    const uniqIds = new Set();

    return data.result.filter((item: ProductType) => {
        if (uniqIds.has(item.id)) return false;
        else {
            uniqIds.add(item.id);
            return true;
        }
    });
};
