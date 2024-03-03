import { type ErrorBoundaryPropsWithComponent } from 'react-error-boundary';

import style from './FallbackComponent.module.css';

export const FallbackComponent: ErrorBoundaryPropsWithComponent['FallbackComponent'] = ({
    error,
    resetErrorBoundary,
}) => {
    return (
        <div className={style.fallback} role='alert'>
            <p>Что-то пошло не так:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Попробуйте снова</button>
        </div>
    );
};
