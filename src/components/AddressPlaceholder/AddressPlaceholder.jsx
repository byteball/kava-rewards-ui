import { ExternalLinkIcon } from "icons";

import appConfig from "appConfig";

export const AddressPlaceholder = ({ address = "" }) => {
  if (!address) return "NO ADDRESS";

  const text = `${address.slice(0, 4)}...${address.slice(address.length - 4, address.length)}`

  return <a target="_blank" rel="noreferrer" className="transition-colors hover:text-white/80" href={`${appConfig.EXPLORER_URL}/address/${address}`}>{text} <ExternalLinkIcon className="inline w-[1.3em] h-[1.3em] ml-[3px] mt-[-0.15em] opacity-50" /> </a>
}
