import { type FC } from 'react';

import style from './Product.module.css';
import { type ProductType } from '../../../services/types';

export const Product: FC<{ product: ProductType }> = ({ product }) => {
    return (
        <li className={style.list_item}>
            <div className={style.field}>{product.id}</div>
            <div className={style.field}>{product.product}</div>
            <div className={style.field}>{product.price}</div>
            <div className={style.field}>{product.brand || 'нет бренда'}</div>
        </li>
    );
};
