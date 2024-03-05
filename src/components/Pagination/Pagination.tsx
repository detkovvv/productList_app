import { type FC } from 'react';

import style from './Pagination.module.css';

export const Pagination: FC = ({ productsPerPage, totalProducts }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <ul className={style.pagination}>
                {pageNumbers.map((number) => (
                    <li className={style.page_item} key={number}>
                        <a className={style.page_link} href='!#'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
