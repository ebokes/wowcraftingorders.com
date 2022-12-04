/**
 * Forces a refresh of all items on the screen. Should be called as follows:
 *
 * useEffect(refreshWowheadLinks, [INSERT_EACH_USE_EFFECT_ITEM_HERE]);
 */
export const refreshWowheadLinks = () => {
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = 'window.$WowheadPower.refreshLinks();';
    document.body.append(inlineScript);

    return () => {
        inlineScript.remove();
    };
};