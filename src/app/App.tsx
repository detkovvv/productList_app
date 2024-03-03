import './App.css';
import { type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FallbackComponent } from '../components/FallbackComponent/FallbackComponent';

export const App: FC = () => {
    return (
        <ErrorBoundary
            FallbackComponent={FallbackComponent}
            onReset={() => {
                location.reload();
            }}
        >
            <div>products</div>
        </ErrorBoundary>
    );
};
