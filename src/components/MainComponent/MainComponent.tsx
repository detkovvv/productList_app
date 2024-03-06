import { useState, useEffect, type FC } from 'react';

import style from './MainComponent.module.css';
import { axiosInstance } from '../../services/axios';
import { type ProductType } from '../../services/types';
import { Pagination } from '../Pagination/Pagination';
import { Product } from '../Product/Product';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(50);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getProducts = async (signal) => {
        try {
            setIsLoading(true);

            const idsResponse = await axiosInstance.post(
                '/',
                {
                    action: 'get_ids',
                    params: {
                        offset: 1,
                        limit: 2,
                    },
                },
                { signal },
            );

            const ids = idsResponse.data.result;

            // отбор уникальных id
            const uniqueIds = Array.from(new Set(ids));

            let fetchedItems: ProductType[] = [];

            // запрос продуктов порционно по 100 ids
            for (let i = 0; i < uniqueIds.length; i += 100) {
                const itemsResponse = await axiosInstance.post('/', {
                    action: 'get_items',
                    params: {
                        ids: uniqueIds.slice(i, i + 100),
                    },
                });

                fetchedItems = [...fetchedItems, ...itemsResponse.data.result];
            }

            setProducts((prevItems) => [...prevItems, ...fetchedItems]);
        } catch (error) {
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

        getProducts(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, []);

    const lastProductIndex = currentPage * productsPerPage;
    const firstProductIndex = lastProductIndex - productsPerPage;
    const currentProducts = products.slice(firstProductIndex, lastProductIndex);
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        console.log(products, currentPage, currentProducts);
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
            <div className={style.navigation}>
                <Pagination
                    currentPage={currentPage}
                    paginate={paginate}
                    productsPerPage={productsPerPage}
                    totalProducts={products.length}
                />
                <button className={`${style.btn_back & style.btn}`}>{'prev page'}</button>
                <button className={`${style.btn_forward & style.btn}`}>{'next page'}</button>
            </div>
            <ul className={style.list}>
                {currentProducts.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </ul>

            {isLoading && <div className={style.loading} />}
        </div>
    );
};
