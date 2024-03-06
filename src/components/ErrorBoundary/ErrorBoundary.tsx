import { Component, type ErrorInfo, type ReactNode } from 'react';

import style from './ErrorBoundary.module.css';

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
};
type ErrorBoundaryProps = {
    children: ReactNode;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            hasError: true,
            error: error,
            errorInfo: errorInfo,
        });
        console.log(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className={style.fallback} role='alert'>
                    <h2>Что-то пошло не так</h2>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <details>{this.state.errorInfo && this.state.errorInfo.componentStack}</details>
                    <button onClick={this.handleReload}>Reload</button>
                </div>
            );
        }
        return this.props.children;
    }
}
