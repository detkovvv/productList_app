export const addUrlParams = (key: string, value: string) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.has(key)) {
        urlSearchParams.delete(key);
    }
    urlSearchParams.append(String(key), value);
    const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
};

export const clearUrlParams = (page: number) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.has('page') && page === 1) {
        urlSearchParams.delete('page');
        const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
        window.history.pushState({ path: newURL }, '', newURL);
    }
};
