export const setUrlParams = (key: string, value: string) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.has(key)) {
        key === 'page' && value === '1'
            ? urlSearchParams.delete(key)
            : urlSearchParams.set(key, value);
    } else {
        urlSearchParams.append(key, value);
    }
    const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
};
