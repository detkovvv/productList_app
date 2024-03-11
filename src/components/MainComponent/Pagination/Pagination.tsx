import React, { type Dispatch, type FC } from 'react';

import style from '../MainComponent.module.css';

type PaginationProps = {
    setCurrentPage: Dispatch<number>;
    currentPage: number;
    listLength: number;
    productsPerPage: number;
};

export const Pagination: FC<PaginationProps> = ({
    setCurrentPage,
    currentPage,
    listLength,
    productsPerPage,
}) => {
    const handleClick = (value: number) => () => {
        setCurrentPage(value);
    };
    return (
        <div className={style.buttons}>
            <button
                className={`${style.btn} ${style.btn_prev}`}
                disabled={currentPage <= 1}
                onClick={handleClick(currentPage - 1)}
            >
                {'prev'}
            </button>
            <button
                className={`${style.btn} ${style.btn_next}`}
                disabled={listLength < productsPerPage}
                onClick={handleClick(currentPage + 1)}
            >
                {'next'}
            </button>
        </div>
    );
};
