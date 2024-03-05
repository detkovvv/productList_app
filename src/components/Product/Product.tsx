import { type FC } from 'react';

import { type ProductType } from '../../services/types';
import style from '../MainComponent/MainComponent.module.css';

export const Product: FC<{ product: ProductType }> = ({ product }) => {
    return (
        <li className={style.list_item} key={product.id}>
            <div className={style.field}>{product.id}</div>
            <div className={style.field}>{product.product}</div>
            <div className={style.field}>{product.price}</div>
            <div className={style.field}>{product.brand || 'нет бренда'}</div>
        </li>
    );
};
