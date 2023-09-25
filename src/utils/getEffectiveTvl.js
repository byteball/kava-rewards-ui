export const getEffectiveTvl = async () => {
  const [
    csData,
    lineTvl
  ] = await Promise.all([
    fetch("https://api.llama.fi/protocol/counterstake").then((res) => res.json()),
    fetch("https://api.llama.fi/tvl/line-token").then((res) => res.json())
  ]);

  return (csData.currentChainTvls.Kava || 0) + (lineTvl || 0);
};
