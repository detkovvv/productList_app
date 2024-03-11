import { type FC } from 'react';

import style from './App.module.css';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { MainComponent } from '../components/MainComponent/MainComponent';

export const App: FC = () => {
    return (
        <ErrorBoundary>
            <div className={style.container}>
                <MainComponent />
            </div>
        </ErrorBoundary>
    );
};
