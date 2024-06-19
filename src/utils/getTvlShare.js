import moment from "moment";

import appConfig from "appConfig";

export const getTvlShare = async (periodString) => {
  const period = periodString === "latest" ? moment.utc() : moment.utc(periodString);
  const periodStart = period.startOf("month").unix();
  const periodEnd = period.endOf("month").unix();

  const [
    csTvl,
    lineTvl,
    kavaGlobalTvl
  ] = await Promise.all([
    fetch(`${appConfig.LLAMA_API_URL}/protocol/counterstake`).then((res) => res.json()).then(data => data.chainTvls.Kava.tvl || []),
    fetch(`${appConfig.LLAMA_API_URL}/protocol/line-token`).then((res) => res.json()).then(data => data.chainTvls.Kava.tvl || []),
    fetch(`${appConfig.LLAMA_API_URL}/v2/historicalChainTvl/Kava`).then((res) => res.json() || []),
  ]);

  const csFilteredTvl = csTvl.filter((tvl) => tvl.date >= periodStart && tvl.date <= periodEnd);
  const csAvgTvl = csFilteredTvl.reduce((acc, { totalLiquidityUSD }) => acc + totalLiquidityUSD, 0) / csFilteredTvl.length;

  const lineFilteredTvl = lineTvl.filter((tvl) => tvl.date >= periodStart && tvl.date <= periodEnd);
  const lineAvgTvl = lineFilteredTvl.reduce((acc, { totalLiquidityUSD }) => acc + totalLiquidityUSD, 0) / lineFilteredTvl.length;

  const kavaFilteredGlobalTvl = kavaGlobalTvl.filter((tvl) => tvl.date >= periodStart && tvl.date <= periodEnd);
  const kavaAvgTvl = kavaFilteredGlobalTvl.reduce((acc, { tvl }) => acc + tvl, 0) / kavaFilteredGlobalTvl.length;

  return (csAvgTvl + lineAvgTvl) / kavaAvgTvl;
};
