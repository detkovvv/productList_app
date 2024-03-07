import { type AxiosError } from 'axios';
import { useState, useEffect, type FC } from 'react';

import style from './MainComponent.module.css';
import { Product } from './Product/Product';
import { axiosInstance } from '../../services/axios';
import { type ProductType } from '../../services/types';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(50);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);

    const getProductsList = async (signal: AbortSignal, page: number) => {
        try {
            setIsLoading(true);
            const offset = (page - 1) * productsPerPage;
            const idsResponse = await axiosInstance.post(
                '/',
                {
                    action: 'get_ids',
                    params: {
                        offset: offset,
                        limit: productsPerPage,
                    },
                },
                { signal },
            );
            const ids = idsResponse.data.result;
            // запрос продуктов
            const itemsResponse = await axiosInstance.post('/', {
                action: 'get_items',
                params: {
                    ids: ids,
                },
            });
            // отбор уникальных продуктов
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

    useEffect(() => {
        const abortController = new AbortController();

        getProductsList(abortController.signal, currentPage);

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
                <ul className={style.navigation_items}>
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
                </ul>
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
