import { type FC } from 'react';

import style from './Loader.module.css';

export const Loader: FC<{ isLoading: boolean }> = ({ isLoading }) => {
    return isLoading && <div className={style.loading} />;
};
