import { useRef, useLayoutEffect } from 'react';

export function useLatest<Value>(value: Value) {
    const valueRef = useRef(value);
    valueRef.current = value;

    useLayoutEffect(() => {
        valueRef.current = value;
    });

    return valueRef;
}
