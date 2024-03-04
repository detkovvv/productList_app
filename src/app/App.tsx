import './App.css';
import { type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FallbackComponent } from '../components/FallbackComponent/FallbackComponent';
import { MainComponent } from '../components/MainComponent/MainComponent';

export const App: FC = () => {
    return (
        <ErrorBoundary
            FallbackComponent={FallbackComponent}
            onReset={() => {
                location.reload();
            }}
        >
            <MainComponent />
        </ErrorBoundary>
    );
};
