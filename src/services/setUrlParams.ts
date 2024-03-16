export const setUrlParams = (key: string, value: string) => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    if ((key === 'page' && value === '1') || value === '') {
        urlSearchParams.delete(key);
    } else {
        urlSearchParams.set(key, value);
    }

    const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
};
