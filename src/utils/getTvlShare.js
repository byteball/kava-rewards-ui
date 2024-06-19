import moment from "moment";
import ls from 'localstorage-slim';

import appConfig from "appConfig";

const TVL_SHARE_CACHE_KEY = 'KAVA_REWARDS_TVL_SHARE';
const TVL_SHARE_EXPIRATION_TS = 60 * 60 * 12; // 12 hours

export const getTvlShare = async (periodString) => {
  const period = periodString === "latest" ? moment.utc() : moment.utc(periodString);
  const periodStart = period.startOf("month").unix();
  const periodEnd = period.endOf("month").unix();

  const cache = ls.get(TVL_SHARE_CACHE_KEY);

  let csTvl, lineTvl, kavaGlobalTvl;

  if (cache) {
    [csTvl, lineTvl, kavaGlobalTvl] = cache;
    console.log('log: tvl share cache');
  } else {
    console.log('log: tvl share fetch');

    [csTvl, lineTvl, kavaGlobalTvl] = await Promise.all([
      fetch(`${appConfig.LLAMA_API_URL}/protocol/counterstake`).then((res) => res.json()).then(data => data.chainTvls.Kava.tvl || []),
      fetch(`${appConfig.LLAMA_API_URL}/protocol/line-token`).then((res) => res.json()).then(data => data.chainTvls.Kava.tvl || []),
      fetch(`${appConfig.LLAMA_API_URL}/v2/historicalChainTvl/Kava`).then((res) => res.json() || []),
    ]);

    ls.set(TVL_SHARE_CACHE_KEY, [csTvl, lineTvl, kavaGlobalTvl], { ttl: TVL_SHARE_EXPIRATION_TS });
  }

  const csFilteredTvl = csTvl.filter((tvl) => tvl.date >= periodStart && tvl.date <= periodEnd);
  const csAvgTvl = csFilteredTvl.reduce((acc, { totalLiquidityUSD }) => acc + totalLiquidityUSD, 0) / csFilteredTvl.length;

  const lineFilteredTvl = lineTvl.filter((tvl) => tvl.date >= periodStart && tvl.date <= periodEnd);
  const lineAvgTvl = lineFilteredTvl.reduce((acc, { totalLiquidityUSD }) => acc + totalLiquidityUSD, 0) / lineFilteredTvl.length;

  const kavaFilteredGlobalTvl = kavaGlobalTvl.filter((tvl) => tvl.date >= periodStart && tvl.date <= periodEnd);
  const kavaAvgTvl = kavaFilteredGlobalTvl.reduce((acc, { tvl }) => acc + tvl, 0) / kavaFilteredGlobalTvl.length;

  return (csAvgTvl + lineAvgTvl) / kavaAvgTvl;
};
