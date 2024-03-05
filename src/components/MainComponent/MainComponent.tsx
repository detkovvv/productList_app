import { useState, useEffect, type FC } from 'react';

import style from './MainComponent.module.css';
import { axiosInstance } from '../../services/axios';
import { type ProductType } from '../../services/types';
import { Product } from '../Product/Product';

export const MainComponent: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getProducts = async () => {
        try {
            setIsLoading(true);

            const idsResponse = await axiosInstance.post('/', {
                action: 'get_ids',
                params: {
                    offset: 1,
                    limit: 150,
                },
            });

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

            const totalItemsCount = ids.length;
            setTotalPages(Math.ceil(totalItemsCount / 50));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    useEffect(() => {
        getProducts();
    }, [currentPage]);

    return (
        <div className={style.main_container}>
            <h1 className={style.main_title}>Product List</h1>
            <ul className={style.head}>
                <li className={style.head_item}>ID</li>
                <li className={style.head_item}>Name</li>
                <li className={style.head_item}>Price</li>
                <li className={style.head_item}>Brand</li>
            </ul>
            <ul className={style.list}>
                {products.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </ul>
            <div>
                <button disabled={currentPage === 1} onClick={handlePrevPage}>
                    Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button disabled={currentPage === totalPages} onClick={handleNextPage}>
                    Next
                </button>
            </div>
            {isLoading && <div className={style.loading} />}
        </div>
    );
};
