import { type FC } from 'react';

import style from './Pagination.module.css';

export const Pagination: FC = ({ currentPage, paginate, productsPerPage, totalProducts }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <ul className={style.pagination}>
                {pageNumbers.map((number) => (
                    <li
                        className={`${currentPage === number ? style.page_item_active : style.page_item}`}
                        key={number}
                    >
                        <a
                            className={`${currentPage === number ? style.page_link_active : style.page_link}`}
                            href='!#'
                            onClick={() => paginate(number)}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
