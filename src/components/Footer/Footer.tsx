import { type FC } from 'react';

import style from './Footer.module.css';

export const Footer: FC = () => {
    return (
        <footer className={style.container}>
            <div className={style.copyright}>© 2023 detkovvv</div>
        </footer>
    );
};
