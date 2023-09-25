import appConfig from "appConfig";

export const getTvl = async () => {
  const [
    csData,
    lineTvl
  ] = await Promise.all([
    fetch(`${appConfig.LLAMA_API_URL}/protocol/counterstake`).then((res) => res.json()),
    fetch(`${appConfig.LLAMA_API_URL}/tvl/line-token`).then((res) => res.json())
  ]);

  return (csData.currentChainTvls.Kava || 0) + (lineTvl || 0);
};
