import ls from 'localstorage-slim';

const KAVA_PRICE_CACHE_KEY = 'KAVA_REWARDS_KAVA_PRICE';
const KAVA_PRICE_EXPIRATION_TS = 60 * 60; // 1 hour

export const getKavaPrice = async () => {

    const cache = ls.get(KAVA_PRICE_CACHE_KEY);

    if (cache) {
        console.log("log: kava price cache", cache);
        return cache;
    }

    const price = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=kava&vs_currencies=usd', {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS"
        }
    }).then((res) => res.json()).then((data) => data.kava.usd);

    console.log("log: kava price fetch", price);

    ls.set(KAVA_PRICE_CACHE_KEY, price, { ttl: KAVA_PRICE_EXPIRATION_TS }) // hour

    return price;
}
