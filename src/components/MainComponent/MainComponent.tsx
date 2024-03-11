import { useState, useEffect, type FC } from 'react';

import { Filters } from './Filter/Filters';
import { Loader } from './Loader/Loader';
import style from './MainComponent.module.css';
import { Pagination } from './Pagination/Pagination';
import { Product } from './Product/Product';
import { getFields } from '../../services/getFields';
import { getProducts } from '../../services/getProducts';
import { type ProductType } from '../../services/types';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 50;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [brands, setBrands] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);
    const [productNames, setProductNames] = useState<string[]>([]);

    useEffect(() => {
        const abortController = new AbortController();
        setIsLoading(true);
        getProducts(abortController.signal, currentPage, productsPerPage).then((result) =>
            setProducts(result),
        );
        getFields(abortController.signal, currentPage, productsPerPage).then((result) => {
            setBrands(result.brands);
            setPrices(result.prices);
            setProductNames(result.products);
        });
        setIsLoading(false);

        return () => {
            abortController.abort();
        };
    }, [currentPage]);

    return (
        <div>
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
                        names={productNames}
                        prices={prices}
                        setIsLoading={setIsLoading}
                        setProducts={setProducts}
                    />
                    <Pagination
                        currentPage={currentPage}
                        listLength={products.length}
                        productsPerPage={productsPerPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </nav>
            <ul className={style.list}>
                {products.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </ul>
            <Loader isLoading={isLoading} />
        </div>
    );
};
