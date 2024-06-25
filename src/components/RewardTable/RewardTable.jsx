import { groupBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import {
	AddressPlaceholder,
	BalanceDrawer,
	PeriodSelector,
	Spin,
	Tooltip
} from "components";

import { historyInstance } from "historyInstance";
import { toLocalString, getTvlShare, getKavaPrice } from "utils";

import backend, { getMonthName } from "services/backend";

const MONTHLY_TOTAL_REWARDS_IN_KAVA = 1_100_000;
const DISTRIBUTION_SHARE= 0.5;

const estimateRewards = async (snapshot, period) => {
	const tvlShare = await getTvlShare(period);

	const kavaPrice = await getKavaPrice();

	const totalRewardsInKava = MONTHLY_TOTAL_REWARDS_IN_KAVA * tvlShare;

	const totalMonthlyReward = kavaPrice * totalRewardsInKava;
	const balances = snapshot.balances;

	const divider = period === "2023-09" ? 3 : 1; // because TVL tracking will start from 2023-09-20

	const assetsByAddress = groupBy(balances, (b) => b.address.toUpperCase());

	return Object.entries(assetsByAddress).map(([walletAddress, assets]) => {

		let totalWalletEffectiveUsdBalance = 0;
		const effective_balances = [];

		assets.forEach(({ effective_usd_balance, home_asset, home_symbol, effective_balance, balance, ...other }) => {
			totalWalletEffectiveUsdBalance += effective_usd_balance;

			effective_balances.push({
				asset: home_asset,
				symbol: home_symbol,
				effective_balance: effective_balance / divider,
				balance: balance / divider,
				effective_usd_balance: effective_usd_balance / divider,
				usd_balance: effective_usd_balance / ((home_symbol === "LINE" ? 2 : 1) * divider),
				...other
			});
		});

		const total_usd_balance = effective_balances.reduce((acc, { usd_balance }) => acc + usd_balance, 0);

		return ({
			address: walletAddress,
			total_effective_usd_balance: totalWalletEffectiveUsdBalance / divider,
			total_usd_balance,
			effective_balances,
			share: totalWalletEffectiveUsdBalance / snapshot.total_effective_usd_balance,
			reward: (((totalMonthlyReward * (totalWalletEffectiveUsdBalance / snapshot.total_effective_usd_balance))) / divider) * DISTRIBUTION_SHARE
		});
	}).sort((a, b) => b.total_effective_usd_balance - a.total_effective_usd_balance);
}

export const RewardTable = () => {
	const [activePeriod, setActivePeriod] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [periods, setPeriods] = useState({ value: [], loaded: false });

	const { period: periodInParams } = useParams();

	const handleChangePeriod = (v) => {
		setActivePeriod(v);
		historyInstance.replace(`/${v.value}`);
	}

	const total = useMemo(() => {
		const result = { reward: 0, effective_balance: 0, balances: [], total_effective_usd_balance: 0 };
		const balances = {};

		data.forEach(({ reward: walletRewards, effective_balances: walletBalances }) => {
			result.reward += walletRewards;

			walletBalances.forEach(({ asset, symbol, balance, effective_balance, effective_usd_balance }) => {
				result.total_effective_usd_balance += effective_usd_balance;

				if (asset in balances) {
					balances[asset] = { ...balances[asset], balance: balances[asset].balance + balance, effective_balance: balances[asset].effective_balance + effective_balance, effective_usd_balance: balances[asset].effective_usd_balance + effective_usd_balance }
				} else {
					balances[asset] = { asset, symbol, balance, effective_balance, effective_usd_balance: effective_usd_balance }
				}
			});
		});

		result.balances = Object.values(balances);

		return result;
	}, [data]);

	useEffect(() => {
		const date = new Date();

		const year = date.getFullYear();
		const month = date.getMonth() + 1;

		const latestPeriod = {
			title: `${getMonthName(month)} ${year} (estimated)`,
			value: 'latest',
			estimated: true
		}

		if (periods.value.length > 1) {
			if (periodInParams && periodInParams !== activePeriod) {
				if (periods.value.find((p) => p.value === periodInParams)) {
					setActivePeriod(periods.value.find((p) => p.value === periodInParams));
				} else {
					console.log("log: no that period, redirect to latest period")
					handleChangePeriod(latestPeriod);
				}
			} else if (!periodInParams) {
				setActivePeriod(latestPeriod);
			}
		} else if (periods.loaded) {
			setActivePeriod(latestPeriod);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [periods]);

	useEffect(() => {
		backend.getPeriods().then(periods => setPeriods({ value: periods, loaded: true }));
	}, []);

	useEffect(() => {
		setLoading(true);

		let intervalId;

		if (activePeriod) {
			if (activePeriod.estimated) {
				backend.getEstimatedSnapshot(activePeriod.value).then(async (snapshot) => {
					const estimatedData = await estimateRewards(snapshot, activePeriod.value);
					setData(estimatedData);
					setLoading(false);
					console.log('log: snapshot was loaded');
				});

				intervalId = setInterval(() => {
					console.log('log: update');

					backend.getEstimatedSnapshot(activePeriod.value).then(async (snapshot) => {
						const estimatedData = await estimateRewards(snapshot, activePeriod.value);
						setData(estimatedData);
						setLoading(false);
					});

				}, 60 * 1000);

			} else {
				backend.getDataByPeriod(activePeriod.value).then(([data]) => {
					const newData = data.sort((a, b) => b.reward - a.reward).filter((d) => d.effective_balances).map((oldData) => {
						const total_usd_balance = oldData.effective_balances?.reduce((acc, { effective_usd_balance, symbol }) => acc + (symbol === "LINE" ? effective_usd_balance / 2 : effective_usd_balance), 0) || 0;

						return ({
							...oldData,
							total_usd_balance
						})
					});

					setData(newData);
					setLoading(false);
				});
			}
		}

		return () => {
			console.log('log: clear interval');

			if (intervalId) {
				clearInterval(intervalId);
			}
		}
	}, [activePeriod]);

	if (!periods.loaded) return <div className="py-20">
		<Spin />
	</div>

	return <div className="p-5">
		<div>
			<PeriodSelector periods={periods.value} active={activePeriod} setActive={handleChangePeriod} />
		</div>

		{!loading ? <>
			{data.length ? <table className="min-w-full">
				<thead className="pl-1 text-white/80">
					<tr className="select-none">
						<th
							scope="col"
							className="py-3.5 pr-3 text-left text-sm font-semibold sm:pl-3">
							Wallet address
						</th>
						<th
							scope="col"
							className="px-3 pr-0 md:pr-3 py-3.5 text-left text-sm font-semibold"
						>
							{activePeriod === 'estimated' ? 'Est.' : ''} Reward <small className="hidden ml-1 font-light opacity-50 md:inline">USD</small>
						</th>
						<th
							scope="col"
							className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
						>
							Avg. effective balance <Tooltip description="Balance in LINE tokens is doubled"><InformationCircleIcon className="inline opacity-60 w-[1.2em] h-[1.2em]" /></Tooltip> <small className="ml-1 font-light opacity-50">USD</small>
						</th>
						<th
							scope="col"
							className="hidden px-3 py-3.5 text-left text-sm font-semibold  lg:table-cell"
						>
							{activePeriod === 'estimated' ? 'Est.' : ''} Wallet APY
						</th>
					</tr>
				</thead>

				<tbody className="space-y-5 text-gray-400">
					{data.map((wallet) => (
						<tr key={wallet.address} className="rounded-xl">
							<td className="w-full py-4 pr-3 text-sm font-medium rounded-tl-lg rounded-bl-lg max-w-0 sm:w-auto sm:max-w-none sm:pl-3">
								<AddressPlaceholder address={wallet.address} />
								<div className="mt-2 md:hidden">
									<BalanceDrawer address={wallet.address} balances={wallet.effective_balances}>
										<button className="select-none text-kava hover:text-kava/60">
											Show balances
										</button>
									</BalanceDrawer>
								</div>
							</td>
							<td className="px-3 py-4 pr-0 text-sm md:pr-3">${toLocalString(Number(wallet.reward).toFixed(2))}</td>
							<td className="hidden px-3 py-4 text-sm md:table-cell">
								<BalanceDrawer address={wallet.address} balances={wallet.effective_balances}>
									<button className="select-none text-kava hover:text-kava/60">
										${toLocalString(Number(wallet.total_effective_usd_balance).toFixed(2))}
									</button>
								</BalanceDrawer></td>
							<td className="hidden px-3 py-4 text-sm lg:table-cell ">{toLocalString(Number(((1 +  (((activePeriod?.value === "2023-09" ? 3 : 1) * wallet.reward) / wallet.total_usd_balance)) ** 12 - 1) * 100).toFixed(2))}%</td>
						</tr>
					))}

					{/* total row */}
					{total.reward !== 0 && <tr key='total' className="border-t-2 border-t-primary-gray rounded-xl">
						<td className="w-full py-4 pr-3 text-sm font-medium rounded-tl-lg rounded-bl-lg max-w-0 sm:w-auto sm:max-w-none sm:pl-3">
							<span>Total</span>
							<div className="mt-2 md:hidden">
								<BalanceDrawer balances={total.balances}>
									<button className="select-none text-kava hover:text-kava/60">
										Show balances
									</button>
								</BalanceDrawer>
							</div>
						</td>
						<td className="px-3 py-4 pr-0 text-sm md:pr-3">${toLocalString(Number(total.reward).toFixed(2))}</td>
						<td className="hidden px-3 py-4 text-sm md:table-cell">
							<BalanceDrawer balances={total.balances}>
								<button className="select-none text-kava hover:text-kava/60">
									${toLocalString(Number(total.total_effective_usd_balance).toFixed(2))}
								</button>
							</BalanceDrawer>
						</td>
						<td></td>
					</tr>}
				</tbody>
			</table> : <div className="py-10 text-center text-white/80">No data</div>}
		</> : <div className="py-20">
			<Spin />
		</div>}
	</div>
}