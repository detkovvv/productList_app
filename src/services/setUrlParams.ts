export const setUrlParams = (key: string, value: string) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    console.log(!!urlSearchParams);
    if ((key === 'page' && value === '1') || value === '') {
        urlSearchParams.delete(key);
    } else {
        urlSearchParams.set(key, value);
    }

    const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
};

export const checkingSearchParams = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlSearchParams.entries()) {
        params[key] = value;
    }
    return params;
};
