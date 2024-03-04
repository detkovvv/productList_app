import axios from 'axios';
import md5 from 'md5';
import { useState, useEffect, type FC } from 'react';

import style from './MainComponent.module.css';
import { API_BASE_URL } from '../../services/axios';
import { type Item } from '../../services/types';

export const MainComponent: FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const authString = generateAuthString();
            const idsResponse = await axios.post(
                API_BASE_URL,
                {
                    action: 'get_ids',
                    params: {
                        offset: 1,
                        limit: 500,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth': authString,
                    },
                },
            );

            const ids = idsResponse.data.result;

            // отбор уникальных id
            const uniqueIds = Array.from(new Set(ids));

            let fetchedItems: Item[] = [];

            // запрос продуктов порционно по 100 ids
            for (let i = 0; i < uniqueIds.length; i += 100) {
                const itemsResponse = await axios.post(
                    API_BASE_URL,
                    {
                        action: 'get_items',
                        params: {
                            ids: uniqueIds.slice(i, i + 100),
                        },
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth': authString,
                        },
                    },
                );

                fetchedItems = [...fetchedItems, ...itemsResponse.data.result];
            }

            setItems((prevItems) => [...prevItems, ...fetchedItems]);

            const totalItemsCount = ids.length;
            setTotalPages(Math.ceil(totalItemsCount / 50));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAuthString = (): string => {
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const password = 'Valantis';
        return md5(`${password}_${timestamp}`);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    useEffect(() => {
        fetchData();
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
                {items.map((item) => (
                    <li className={style.list_item} key={item.id}>
                        <div className={style.field}>{item.id}</div>
                        <div className={style.field}>{item.product}</div>
                        <div className={style.field}>{item.price}</div>
                        <div className={style.field}>{item.brand || 'нет бренда'}</div>
                    </li>
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
