import { type FC } from 'react';

import style from './Header.module.css';

export const Header: FC = () => {
    return (
        <header>
            <h1 className={style.header_title}>Product List</h1>
            <ul className={style.head}>
                <li className={style.head_item}>ID</li>
                <li className={style.head_item}>Product</li>
                <li className={style.head_item}>Price</li>
                <li className={style.head_item}>Brand</li>
            </ul>
        </header>
    );
};
