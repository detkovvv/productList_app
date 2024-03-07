import { type AxiosError } from 'axios';
import { useState, useEffect, type FC } from 'react';

import { Filter } from './Filter/Filter';
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
    const [currentIds, setCurrentIds] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [prices, setPrices] = useState<number[]>([]);
    const [names, setNames] = useState<string[]>([]);

    const getProducts = async (signal: AbortSignal, page: number) => {
        try {
            setIsLoading(true);
            const offset = (page - 1) * productsPerPage;
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
            setCurrentIds(Array.from(uniqIds));
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
        try {
            const fieldNames = ['brand', 'price', 'product'];
            const offset = (page - 1) * productsPerPage;
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
            setBrands(brandsData.filter((item) => item !== null));
            setPrices(pricesData.filter((item) => item !== null));
            setNames(namesData.filter((item) => item !== null));
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

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedName, setSelectedName] = useState('');

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
        // getFilteredProducts();
    };

    const handlePriceChange = (event) => {
        setSelectedPrice(event.target.value);
        // getFilteredProducts();
    };

    const handleNameChange = (event) => {
        setSelectedName(event.target.value);
        // getFilteredProducts();
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
                    <Filter
                        brands={brands}
                        handleBrandChange={handleBrandChange}
                        handleNameChange={handleNameChange}
                        handlePriceChange={handlePriceChange}
                        names={names}
                        prices={prices}
                        selectedBrand={selectedBrand}
                        selectedName={selectedName}
                        selectedPrice={selectedPrice}
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
