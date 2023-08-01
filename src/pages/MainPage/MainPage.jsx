import { Footer, HeroBlock, HowItWorks, RewardTable } from "components";

export const MainPage = () => (<div>
	<div className="min-h-[100vh]">
		<HeroBlock />
		<HowItWorks />
		<div className="max-w-5xl px-6 mx-auto lg:px-8">
			<div className="w-full mt-16 rounded-md shadow-2xl bg-gray-950 ring-2 ring-primary-gray sm:mt-24 shadow-primary-gray">
				<RewardTable />
			</div>
		</div>
	</div>
	<Footer />
</div>)
