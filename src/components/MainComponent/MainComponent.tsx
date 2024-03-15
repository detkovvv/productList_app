import { useState, useEffect, type FC } from 'react';

import { Filters } from './Filters/Filters';
import { Loader } from './Loader/Loader';
import style from './MainComponent.module.css';
import { Pagination } from './Pagination/Pagination';
import { Product } from './Product/Product';
import { getFields } from '../../services/getFields';
import { getFilteredProducts } from '../../services/getFilteredProducts';
import { getProducts } from '../../services/getProducts';
import { setUrlParams } from '../../services/setUrlParams';
import { type FieldsData, type ProductType, type SelectedFilterType } from '../../services/types';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 50;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [brands, setBrands] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);
    const [productNames, setProductNames] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<SelectedFilterType>({});

    const onChange = (newFilter: SelectedFilterType) => {
        setSelectedFilter(newFilter);
    };

    useEffect(() => {
        const abortController = new AbortController();
        setIsLoading(true);

        Promise.allSettled([
            getProducts(abortController.signal, currentPage, productsPerPage),
            getFields(abortController.signal, currentPage, productsPerPage),
        ])
            .then(([productsResult, fieldsResult]) => {
                if (productsResult.status === 'fulfilled') {
                    setProducts(productsResult.value);
                }
                if (fieldsResult.status === 'fulfilled') {
                    const result = fieldsResult.value as FieldsData;
                    setBrands(result.brands.filter((item) => item != null));
                    setPrices(result.prices);
                    setProductNames(result.products);
                }
            })
            .finally(() => setIsLoading(false));

        return () => {
            abortController.abort();
        };
    }, [currentPage]);

    useEffect(() => {
        setIsLoading(true);
        const abortController = new AbortController();
        getFilteredProducts(abortController.signal, selectedFilter)
            .then((result) => setProducts(result))
            .finally(() => setIsLoading(false));
        return () => {
            abortController.abort();
        };
    }, [selectedFilter]);

    useEffect(() => {
        const keys = Object.keys(selectedFilter);
        const value = selectedFilter[keys[0]];
        value !== undefined && setUrlParams('filter', String(value));
    }, [selectedFilter]);

    useEffect(() => {
        setUrlParams('page', String(currentPage));
    }, [currentPage]);

    return (
        <main className={style.container}>
            <nav className={style.navigation}>
                <div className={style.navigation_items}>
                    <Filters
                        brands={brands}
                        names={productNames}
                        onChange={onChange}
                        prices={prices}
                        selectedFilter={selectedFilter}
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
        </main>
    );
};
