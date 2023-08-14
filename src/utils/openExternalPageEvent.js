import ga4 from "react-ga4";

import appConfig from "appConfig";

const SOCIAL_MEDIA = ["TWITTER", "TELEGRAM", "DISCORD", "GITHUB", "MEDIUM", "WE_CHAT", "YOUTUBE", "REDDIT", "BITCOINTALK", "FACEBOOK"];
const PAGES = ["CS", "LINE", "CS-CREATE", "KAVA-RISE", "KAVA-DEFILLAMA", "ADD-NETWORK", "DOWNLOAD-METAMASK", "KAVA-ADDRESS-CONVERTER", "OBYTE", ...SOCIAL_MEDIA];
const BLOCKS = ["HERO-BLOCK", "OPTION-1", "OPTION-2", "APY", "STARTED", "FOOTER"];

export const openExternalPageEvent = (from, page) => {
  if (PAGES.includes(page)) {
    if (BLOCKS.includes(from)) {
      if (appConfig.TESTNET || !appConfig.GA_MEASUREMENT_ID) {
        console.log(`log: openExternalPageEvent ${from}->${page}`);
      } else {
        ga4.event({
          category: "transitions",
          action: `GO-TO-${page}`,
          value: from,
        });
      }
    } else {
      throw new Error("unknown block");
    }
  } else {
    throw new Error("unknown page");
  }
}