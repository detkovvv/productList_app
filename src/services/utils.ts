import { type ProductType } from './types';

export const filterById = (data: ProductType[]) => {
    const uniqIds = new Set();

    return data.filter((item) => {
        if (uniqIds.has(item.id)) return false;
        else {
            uniqIds.add(item.id);
            return true;
        }
    });
};
