import './App.css';
import { type FC } from 'react';

import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { MainComponent } from '../components/MainComponent/MainComponent';

export const App: FC = () => {
    return (
        <ErrorBoundary>
            <MainComponent />
        </ErrorBoundary>
    );
};
