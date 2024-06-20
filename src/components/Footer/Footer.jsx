import { openExternalPageEvent } from "utils";

export const Footer = () => (<div className="max-w-md mx-auto mt-10 md:max-w-2xl lg:px-8">
  <div className="flex flex-wrap justify-center space-x-5">
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "TWITTER")} href="https://twitter.com/ObyteOrg" target="_blank" rel="noopener"><img src="/social_media/x.svg" alt="Obyte X (Twitter)" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "TELEGRAM")} href="https://t.me/obyteorg" target="_blank" rel="noopener"><img src="/social_media/telegram.svg" alt="Obyte telegram" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "DISCORD")} href="https://discord.obyte.org/" target="_blank" rel="noopener"><img src="/social_media/discord.svg" alt="Obyte discord" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "MEDIUM")} href="https://blog.obyte.org/" target="_blank" rel="noopener"><img src="/social_media/medium.svg" alt="Obyte medium" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "WE_CHAT")} href="https://mp.weixin.qq.com/s/JB0_MlK6w--D6pO5zPHAQQ" target="_blank" rel="noopener"><img src="/social_media/weixin.svg" alt="Obyte weixin" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "YOUTUBE")} href="https://www.youtube.com/@ObyteOrg" target="_blank" rel="noopener"><img src="/social_media/youtube.svg" alt="Obyte YouTube" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "REDDIT")} href="https://www.reddit.com/r/obyte/" target="_blank" rel="noopener"><img src="/social_media/reddit.svg" alt="Obyte reddit" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "BITCOINTALK")} href="https://bitcointalk.org/index.php?topic=1608859.0" target="_blank" rel="noopener"><img src="/social_media/bitcointalk.svg" alt="Obyte bitcointalk" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "FACEBOOK")} href="https://www.facebook.com/obyte.org" target="_blank" rel="noopener"><img src="/social_media/facebook.svg" alt="Obyte facebook" /></a>
    <a className="p-2 hover:opacity-70" onClick={() => openExternalPageEvent("FOOTER", "GITHUB")} href="https://github.com/byteball" target="_blank" rel="noopener"><img src="/social_media/github.svg" alt="Obyte github" /></a>
  </div>
  <div className="p-10 text-center text-white/40"><a href="https://obyte.org" target="_blank" rel="noopener" onClick={() => openExternalPageEvent("FOOTER", "OBYTE")}>Built on Obyte</a></div>
</div>)