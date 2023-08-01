import { Logos } from "components";

export const HeroBlock = () => <>
	<div className="pb-12 pt-18 sm:pt-20 sm:pb-16 lg:pb-20">
		<div className="max-w-5xl px-6 mx-auto lg:px-8">
			<div className="max-w-2xl mx-auto text-center">
				<div className="mb-16">
					<Logos />
				</div>
				<h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
					Rewards from <div className="text-kava">Kava Rise</div>
				</h1>
				<p className="max-w-3xl mx-auto mt-6 text-2xl font-bold leading-8 text-white">
					Get a share of Kava Rise rewards by simply holding tokens imported from Kava in your Obyte wallet
				</p>
			</div>

			<div className="max-w-4xl mx-auto mt-5 text-center text-md text-white/80">
				Kava Rise program rewards us for the TVL that our dapps <a href="https://counterstake.org" target="_blank" className="underline" rel="noopener">Counterstake</a> and <a href="https://linetoken.org" target="_blank" className="underline" rel="noopener">LINE</a> create on the Kava network. We share 90% of these rewards with you if you actually contribute to this TVL and hold the tokens imported through Counterstake bridge in your Obyte wallet.
			</div>
		</div>
	</div>
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
</>
