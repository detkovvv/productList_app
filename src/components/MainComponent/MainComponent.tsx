import { useState, useEffect, type FC } from 'react';

import { Filters } from './Filter/Filters';
import style from './MainComponent.module.css';
import { Product } from './Product/Product';
import { getFields } from '../../services/getFields';
import { getProducts } from '../../services/getProducts';
import { type ProductType } from '../../services/types';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage: number = 50;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [brands, setBrands] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        const abortController = new AbortController();

        getProducts(
            abortController.signal,
            currentPage,
            setIsLoading,
            productsPerPage,
            setProducts,
            setIsFirstPage,
            setIsLastPage,
        );
        getFields(
            abortController.signal,
            currentPage,
            setIsLoading,
            productsPerPage,
            setBrands,
            setPrices,
            setNames,
        );

        return () => {
            abortController.abort();
        };
    }, [currentPage]);

    const handleNextClick = () => {
        if (!isLastPage) setCurrentPage(currentPage + 1);
    };
    const handlePrevClick = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className={style.main_container}>
            <h1 className={style.main_title}>Product List</h1>
            <ul className={style.head}>
                <li className={style.head_item}>ID</li>
                <li className={style.head_item}>Product</li>
                <li className={style.head_item}>Price</li>
                <li className={style.head_item}>Brand</li>
            </ul>
            <nav className={style.navigation}>
                <div className={style.navigation_items}>
                    <Filters
                        brands={brands}
                        names={names}
                        prices={prices}
                        setIsLoading={setIsLoading}
                        setProducts={setProducts}
                    />
                    <div className={style.buttons}>
                        <button
                            className={`${style.btn} ${style.btn_prev}`}
                            disabled={isFirstPage}
                            onClick={handlePrevClick}
                        >
                            {'prev'}
                        </button>
                        <button
                            className={`${style.btn} ${style.btn_next}`}
                            disabled={isLastPage}
                            onClick={handleNextClick}
                        >
                            {'next'}
                        </button>
                    </div>
                </div>
            </nav>
            <ul className={style.list}>
                {products.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </ul>
            {isLoading && <div className={style.loading} />}
        </div>
    );
};
