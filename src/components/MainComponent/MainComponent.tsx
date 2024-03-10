import { type AxiosError } from 'axios';
import { useState, useEffect, type FC } from 'react';

import { Filters } from './Filter/Filters';
import style from './MainComponent.module.css';
import { Product } from './Product/Product';
import { fetching } from '../../services/requests';
import { type ProductType } from '../../services/types';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(50);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [brands, setBrands] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);
    const [names, setNames] = useState<string[]>([]);

    const getProducts = async (signal: AbortSignal, page: number) => {
        setIsLoading(true);
        const offset = (page - 1) * productsPerPage;
        try {
            const idsResponse = await fetching(
                'get_ids',
                { offset: offset, limit: productsPerPage },
                signal,
            );
            const ids = idsResponse.data.result;
            // запрос продуктов
            const itemsResponse = await fetching(
                'get_items',
                {
                    ids: ids,
                },
                signal,
            );
            const uniqIds = new Set();
            const filteredResponse = itemsResponse.data.result.filter((item: ProductType) => {
                if (uniqIds.has(item.id)) return false;
                else {
                    uniqIds.add(item.id);
                    return true;
                }
            });
            setProducts(filteredResponse);
            setIsFirstPage(page === 1);
            setIsLastPage(filteredResponse.length < productsPerPage - 5);
        } catch (axiosError) {
            const error = axiosError as AxiosError;
            if (error.name === 'AbortError') {
                console.log('Request aborted', error.message);
            } else {
                console.error('Error fetching data:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const getFields = async (signal: AbortSignal, page: number) => {
        setIsLoading(true);
        const offset = (page - 1) * productsPerPage;
        try {
            const fieldNames = ['brand', 'price', 'product'];

            const fieldsData = await Promise.all(
                fieldNames.map(async (field) => {
                    const fieldResponse = await fetching(
                        'get_fields',
                        {
                            field: field,
                            offset: offset,
                            limit: productsPerPage,
                        },
                        signal,
                    );
                    return fieldResponse.data.result;
                }),
            );
            const [brandsData, pricesData, namesData] = fieldsData;
            setBrands(brandsData.filter((item: string | null) => item !== null));
            setPrices(pricesData.filter((item: string | null) => item !== null));
            setNames(namesData.filter((item: string | null) => item !== null));
        } catch (axiosError) {
            const error = axiosError as AxiosError;
            if (error.name === 'AbortError') {
                console.log('Request aborted', error.message);
            } else {
                console.error('Error fetching data:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const abortController = new AbortController();

        getProducts(abortController.signal, currentPage);
        getFields(abortController.signal, currentPage);

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
                <li className={style.head_item}>Name</li>
                <li className={style.head_item}>Price</li>
                <li className={style.head_item}>Brand</li>
            </ul>
            <nav className={style.navigation}>
                <div className={style.navigation_items}>
                    <button
                        className={`${style.btn} ${style.btn_prev}`}
                        disabled={isFirstPage}
                        onClick={handlePrevClick}
                    >
                        prev
                    </button>
                    <button
                        className={`${style.btn} ${style.btn_next}`}
                        disabled={isLastPage}
                        onClick={handleNextClick}
                    >
                        next
                    </button>
                    <Filters
                        brands={brands}
                        names={names}
                        prices={prices}
                        setIsLoading={setIsLoading}
                        setProducts={setProducts}
                    />
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
