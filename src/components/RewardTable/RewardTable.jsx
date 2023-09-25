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
import { toLocalString, getEffectiveTvl } from "utils";

import backend from "services/backend";

const REWARD_RATE = 0.07;

const estimateRewards = async (snapshot) => {
	const totalEffectiveTvl = await getEffectiveTvl();
	const totalMonthlyReward = (totalEffectiveTvl * REWARD_RATE) / 12;
	const balances = snapshot.balances;

	const assetsByAddress = groupBy(balances, (b) => b.address.toUpperCase());

	return Object.entries(assetsByAddress).map(([walletAddress, assets]) => {

		let totalWalletEffectiveUsdBalance = 0;
		const balances = [];

		assets.forEach(({ effective_usd_balance, home_asset, home_symbol, effective_balance, balance, ...other }) => {
			totalWalletEffectiveUsdBalance += effective_usd_balance;

			balances.push({
				asset: home_asset,
				symbol: home_symbol,
				effective_balance,
				balance,
				effective_usd_balance,
				...other
			});
		});

		return ({
			address: walletAddress,
			total_effective_usd_balance: totalWalletEffectiveUsdBalance,
			balances,
			share: totalWalletEffectiveUsdBalance / snapshot.total_effective_usd_balance,
			reward: totalMonthlyReward * totalWalletEffectiveUsdBalance / snapshot.total_effective_usd_balance
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
		historyInstance.replace(`/${v}`);
	}

	const total = useMemo(() => {
		const result = { reward: 0, effective_balance: 0, balances: [] };
		const balances = {};

		data.forEach(({ reward: walletRewards, total_effective_usd_balance, balances: walletBalances }) => {
			result.reward += walletRewards;
			result.effective_balance += total_effective_usd_balance;

			walletBalances.forEach(({ asset, symbol, balance, effective_balance }) => {
				if (asset in balances) {
					balances[asset] = { ...balances[asset], balance: balances[asset].balance + balance, effective_balance: balances[asset].effective_balance + effective_balance }
				} else {
					balances[asset] = { asset, symbol, balance, effective_balance }
				}
			});
		});

		result.balances = Object.values(balances);

		return result;
	}, [data]);

	useEffect(() => {
		if (periods.length > 1) {
			if (periodInParams && periodInParams !== activePeriod) {
				if (periods.value.find((p) => p.value === periodInParams)) {
					setActivePeriod(periodInParams);
				} else {
					console.log("log: no that period, redirect to estimated period")
					handleChangePeriod('estimated');
				}
			} else if (!periodInParams) {
				setActivePeriod('estimated');
			}
		} else if (periods.loaded) {
			setActivePeriod('estimated');
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
			if (activePeriod === "estimated") {
				backend.getEstimatedSnapshot().then(async (snapshot) => {
					const estimatedData = await estimateRewards(snapshot);
					setData(estimatedData);
					setLoading(false);
					console.log('log: snapshot was loaded');
				});

				intervalId = setInterval(() => {
					console.log('log: update');

					backend.getEstimatedSnapshot().then(async (snapshot) => {
						const estimatedData = await estimateRewards(snapshot);
						setData(estimatedData);
						setLoading(false);
					});

				}, 60 * 1000);

			} else {
				backend.getDataByPeriod(activePeriod).then(([data, total]) => {
					setData(data);
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
							Reward share
						</th>
					</tr>
				</thead>

				<tbody className="space-y-5 text-gray-400">
					{data.map((wallet) => (
						<tr key={wallet.address} className="rounded-xl">
							<td className="w-full py-4 pr-3 text-sm font-medium rounded-tl-lg rounded-bl-lg max-w-0 sm:w-auto sm:max-w-none sm:pl-3">
								<AddressPlaceholder address={wallet.address} />
								<div className="mt-2 md:hidden">
									<BalanceDrawer address={wallet.address} balances={wallet.balances}>
										<button className="select-none text-kava hover:text-kava/60">
											Show balances
										</button>
									</BalanceDrawer>
								</div>
							</td>
							<td className="px-3 py-4 pr-0 text-sm md:pr-3">${toLocalString(Number(wallet.reward).toFixed(2))}</td>
							<td className="hidden px-3 py-4 text-sm md:table-cell">
								<BalanceDrawer address={wallet.address} balances={wallet.balances}>
									<button className="select-none text-kava hover:text-kava/60">
										${toLocalString(Number(wallet.total_effective_usd_balance).toFixed(2))}
									</button>
								</BalanceDrawer></td>
							<td className="hidden px-3 py-4 text-sm lg:table-cell ">{toLocalString(Number(wallet.share * 100).toFixed(3))}%</td>
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
									${toLocalString(Number(total.effective_balance).toFixed(2))}
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