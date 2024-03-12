export const updateURL = (key: string, value: string) => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append(String(key), value);
    const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
};
