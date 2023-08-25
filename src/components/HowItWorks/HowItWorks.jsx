import { changeNetwork, openExternalPageEvent } from "utils";

export const HowItWorks = () => (<div className="max-w-5xl px-6 mx-auto lg:px-8">
  <h2 className="max-w-2xl px-10 mx-auto mt-10 mb-20 text-4xl font-bold text-center text-white">Here is how to take advantage of these rewards</h2>

  <div className="flex flex-col items-center justify-between mt-10 space-x-5 md:flex-row">
    <div className="w-full md:w-[50%] flex justify-center">
      <img className="max-w-[60%] mb-5 md:mb-0 md:max-w-[90%]" src="/bridge-any-token-from-kava.svg" alt="Bridge any token from Kava" />
    </div>
    <div className="w-full md:w-[50%]">
      <h3 className="text-2xl font-bold text-kava">Option 1: Bridge any token from Kava</h3>
      <div className="mt-5 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">1</div>
          <div>Buy any token on Kava network (such as USDT or KAVA token)</div>
        </div>


        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">2</div>
          <div>Bridge it to Obyte via Counterstake</div>
        </div>


        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">3</div>
          <div>Just hold the bridged tokens in your Obyte wallet.</div>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-white/80">
        <div>This works for any token that is listed on Coingecko and has a bridge to Obyte on <a href="https://counterstake.org" onClick={()=> openExternalPageEvent("OPTION-1", "CS")} target="_blank" rel="noopener" className="underline text-kava">Counterstake</a>. If it doesn’t have a bridge yet, you can <a href="https://counterstake.org/create" onClick={()=> openExternalPageEvent("OPTION-1", "CS-CREATE")}  target="_blank" rel="noopener" className="underline text-kava">add it</a>.</div>
        <div>You would be rewarded for the TVL you create on the Kava side of Counterstake when you bridge the token.</div>
        <div>You can also just buy Kava tokens (e.g. KAVA, KUSDT, KUSDC) on <a href="https://oswap.io" target="_blank" rel="noopener" onClick={() => openExternalPageEvent("OPTION-1", "OSWAP")} className="underline text-kava">oswap.io</a> and hold them to get rewards.</div>
      </div>
    </div>
  </div>

  <div className="flex flex-col-reverse items-center justify-between mt-20 space-x-5 md:flex-row">
    <div className="w-full md:w-[50%]">
      <h3 className="text-2xl font-bold text-kava">Option 2: Get increased rewards on your GBYTE</h3>
      <div className="mt-5 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">1</div>
          <div>Bridge your GBYTE from Obyte to Kava.</div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">2</div>
          <div>Use your GBYTE-on-Kava to borrow LINE tokens in the <a href="https://linetoken.org/" target="_blank" rel="noopener" onClick={()=> openExternalPageEvent("OPTION-2", "LINE")} className="underline text-kava">LINE dapp</a>.</div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">3</div>
          <div>Bridge your LINE tokens back to Obyte.</div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-kava/20 text-white/60">4</div>
          <div>Just hold them in your Obyte wallet.</div>
        </div>
      </div>

      <div className="mt-5 space-y-4 text-white/80">
        <div>This way, you create TVL both in the LINE dapp and in the Counterstake bridge and get a <b>double rate of reward </b> for holding LINE tokens in your Obyte wallet.</div>
        <div>LINE tokens are price-protected, meaning that you can convert them back to the same amount of GBYTEs (minus fees). You retain your exposure to GBYTE when borrowing LINE. Learn more about LINE’s price protection on its <a href="https://linetoken.org" target="_blank" rel="noopener" onClick={() => openExternalPageEvent("OPTION-2", "LINE")} className="underline text-kava">website</a>.</div>
        <div>You can also just buy LINE on <a href="https://oswap.io" target="_blank" rel="noopener" onClick={() => openExternalPageEvent("OPTION-2", "OSWAP")} className="underline text-kava">oswap.io</a> and hold to get double rewards, however in this case you don't get price protection.</div>
      </div>
    </div>
    <div className="w-full md:w-[50%] flex justify-center"><img className="max-w-[60%] mb-5 md:mb-0 md:max-w-[90%]" src="/get-increased-rewards-on-your-gbyte.svg" alt="Get increased rewards on your GBYTE" /></div>
  </div>

  <div className="relative">
    <div
      className="absolute inset-x-0 top-0 left-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-10rem]"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(10%+3rem)] aspect-[1155/978] w-[46.125rem] -translate-x-1/2 bg-[#80818D] opacity-20 sm:left-[calc(10%+36rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>

    <h2 className="max-w-2xl px-10 mx-auto mt-20 mb-20 text-4xl font-bold text-center text-white">What are the APYs?</h2>

    <div className="flex flex-col items-center justify-between mt-20 md:space-x-5 md:flex-row">
      <div className="w-full md:w-[50%]">
        <div className="mb-5 text-4xl font-bold tracking-tight text-white sm:text-7xl md:mb-0">
          <div><span className="text-kava">Kava</span></div>
          <div><span className="text-kava">Rise</span></div>
          <div>Program</div>
        </div>
      </div>

      <div className="w-full md:w-[50%] space-y-4">
      <div>Kava distributes 1,000,000 KAVA tokens (about $1m) monthly to all dapps that participate in the <a href="https://www.kava.io/developer-rewards" target="_blank" rel="noopener nofollow" className="underline text-kava" onClick={()=> openExternalPageEvent("APY", "KAVA-RISE")}>Kava Rise program</a>. The program rewards for TVL, and our share of rewards depends on our share in the total <a href="https://defillama.com/chain/Kava" className="underline text-kava" target="_blank" rel="noopener nofollow" onClick={()=> openExternalPageEvent("APY", "KAVA-DEFILLAMA")}>Kava TVL as tracked by DefiLlama</a>. It varies from month to month.</div>
        <div>The latest APY from Kava Rise is 7%. That’s what you are expected to earn for holding any tokens other than LINE. For holding LINE, you get a double of that. </div>
        <div>The rewards for holding LINE are based on the current price of LINE which might be different from the token’s price when you borrowed it. While the token is price protected, the rewards are not, however you can always repay the loan and re-borrow more tokens at a new rate if the price of LINE has decreased.</div>
      </div>
    </div>

  </div>

  <h2 className="max-w-2xl px-10 mx-auto mt-20 mb-20 text-4xl font-bold text-center text-white">How to get started on Kava?</h2>

  <div className="flex flex-col-reverse items-center justify-between mt-20 space-x-5 md:flex-row">
    <div className="w-full md:w-[50%] space-y-4">
      <div>First, <button onClick={() => changeNetwork() && openExternalPageEvent("STARTED", "ADD-NETWORK")} className="underline cursor-pointer text-kava">add Kava</button> to your <a href="https://metamask.io/download" target="_blank" rel="noopener nofollow" className="underline text-kava" onClick={()=> openExternalPageEvent("STARTED", "DOWNLOAD-METAMASK")}>MetaMask</a>.</div>
      <div>Then, you’ll need a small amount of KAVA (the native token of Kava) in order to send transactions on the Kava network. You can buy KAVA on Binance and some other exchanges. When withdrawing KAVA to your MetaMask, note that some exchanges expect your Kava EVM address that you can see in your MetaMask (it starts with 0x), while other exchanges require a Cosmos based Kava address (starts with 'kava'). In the latter case, use this <a href="https://docs.kava.io/docs/ethereum/address_conversion/" target="_blank" className="underline text-kava" rel="noopener nofollow" onClick={() => openExternalPageEvent("STARTED", "KAVA-ADDRESS-CONVERTER")}>Kava address converter</a> to convert between EVM (your MetaMask) and Cosmos addresses on Kava. Either way, you get your tokens to your MetaMask and don't need to deal with Kava's Cosmos network.</div>
      <div>In Counterstake, use EVM based Kava addresses (they start with 0x).</div>
    </div>
    <div className="w-full md:w-[50%] mb-5 md:mb-0 flex justify-center">
      <img className="max-w-[250px]" alt="Kava MetaMask" src="/kava-metamask.svg" />
    </div>
  </div>

  <h2 className="max-w-2xl px-3 mx-auto mt-20 mb-20 text-3xl font-bold text-center text-white md:px-10 md:text-4xl">When are the rewards distributed?</h2>

  <div className="flex flex-col items-center justify-between mt-20 space-x-5 md:flex-row">
    <div className="w-full md:w-[50%] mb-5 md:mb-0 flex justify-center">
      <img className="w-[200px]" src="/calendar.svg" alt="When are the rewards distributed?" />
    </div>

    <div className="w-full md:w-[50%]">
      We receive the rewards from Kava monthly, for the previous month in the first days of the following month. We get them in KAVA, buy GBYTE for KAVA, and distribute the GBYTE proceeds to all users in proportion to their average effective balances (with LINE balances counted twice) during the previous month. The rewards are just sent to your wallet address that holds LINE and other tokens, you don’t have to do anything.
    </div>
  </div>
</div>)
