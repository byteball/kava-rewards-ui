export default {
  TESTNET: process.env.REACT_APP_TESTNET === "1",
  EXPLORER_URL: process.env.REACT_APP_TESTNET === "1" ? "https://testnetexplorer.obyte.org" : "https://explorer.obyte.org",
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  OSWAP_STATS_API_URL: process.env.REACT_APP_OSWAP_STATS_API_URL,
  RPC_META: process.env.REACT_APP_TESTNET === "1"
    ? {
      chainId: "0x13881",
      chainName: "Polygon TEST Network",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    }
    : {
      chainId: "0x8ae",
      chainName: "Kava EVM Network",
      nativeCurrency: {
        name: "KAVA",
        symbol: "KAVA",
        decimals: 18,
      },
      rpcUrls: ["https://evm.kava.io"],
      blockExplorerUrls: ["https://explorer.kava.io/"],
    },
}
