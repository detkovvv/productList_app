import { type FC } from 'react';

import style from './App.module.css';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { MainComponent } from '../components/MainComponent/MainComponent';

export const App: FC = () => {
    return (
        <ErrorBoundary>
            <div className={style.wrapper}>
                <Header />
                <MainComponent />
                <Footer />
            </div>
        </ErrorBoundary>
    );
};
