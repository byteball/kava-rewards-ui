import { groupBy } from "lodash";

import appConfig from "appConfig";

class Backend {
	constructor(endpointUrl) {
		this.endpointUrl = endpointUrl;
	}

	async getEstimatedSnapshot(period) {
		const avgBalancesOrSnapshot = await fetch(`${this.endpointUrl}/${period === '2023-09' ? 'snapshots' : 'average_balances'}/${period === '2023-09' ? '1900' : period}`, { //period === '2023-09' ? 'snapshots' :
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data);
		
		if (period === "2023-09") return avgBalancesOrSnapshot;

		const totalEffectiveUsdBalance = avgBalancesOrSnapshot.reduce((acc, { effective_usd_balance }) => acc + effective_usd_balance, 0);

		return ({
			balances: avgBalancesOrSnapshot,
			total_effective_usd_balance: totalEffectiveUsdBalance
		});
	}

	async getPeriods() {
		const date = new Date();
		const startPeriod = "2023-09";

		const defaultPeriods = [{ value: 'latest', title: `${getMonthName(date.getMonth() + 1)} ${date.getFullYear()} (estimated)`, estimated: true }];

		const periodsData = await fetch(`${this.endpointUrl}/periods`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data);

		// [...periodsData, { period: '2023-05' }] for test
		const loadedPeriods = periodsData.map(({ period }) => {
			const [year, month] = period.split("-");

			return ({
				value: period,
				title: `${getMonthName(month)} ${year}`,
				estimated: false
			})
		});

		const estimatedPeriods = [];
		const startDate = new Date(startPeriod);

		while (true) {
			const year = startDate.getFullYear();
			const month = startDate.getMonth() + 1;

			const period = `${year}-${month.toString().padStart(2, '0')}`;

			if (year > date.getFullYear() || (year === date.getFullYear() && month > date.getMonth())) break;

			if (!loadedPeriods.find(({ value }) => value === period)) {
				estimatedPeriods.unshift({
					value: `${year}-${month.toString().padStart(2, '0')}`,
					title: `${getMonthName(month)} ${year} (estimated)`,
					estimated: true
				});
			}

			startDate.setMonth(startDate.getMonth() + 1);
		}

		return [...defaultPeriods, ...loadedPeriods, ...estimatedPeriods];
	}

	async getAvgBalancesByPeriod(period) {
		// for test (remove it)
		// return fetch(`${this.endpointUrl}/snapshots/latest`, {
		// 	method: "GET",
		// 	cache: "no-cache"
		// }).then(r => r.json()).then(r => r.data.balances);

		return fetch(`${this.endpointUrl}/average_balances/${period}`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data);
	}

	async getGbytePrice() {
		return await fetch(`${appConfig.OSWAP_STATS_API_URL}/exchangeRates`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then((rates) => rates.GBYTE_USD);
	}

	async getDataByPeriod(period) {
		let avgBalances;

		if (period === "2023-09") {
			const avgBalances1 = await this.getAvgBalancesByPeriod(period).then((b) => b.map((data) => ({
				...data,
				balance: data.balance * (1 / 4),
				effective_balance: data.effective_balance * (1 / 4),
				effective_usd_balance: data.effective_usd_balance * (1 / 4)
			})));

			const avgBalances2 = await this.getAvgBalancesByPeriod("2023-10").then((b) => b.map((data) => ({
				...data,
				balance: data.balance * (3 / 4),
				effective_balance: data.effective_balance * (3 / 4),
				effective_usd_balance: data.effective_usd_balance * (3 / 4)
			})));

			avgBalances = [...avgBalances1, ...avgBalances2];
		} else {
			avgBalances = await this.getAvgBalancesByPeriod(period);
		}

		const avgBalancesByAddress = groupBy(avgBalances, (b) => b.address.toUpperCase());
		const gbytePrice = await this.getGbytePrice();
		const effectiveBalances = {};
		const effectiveUSDBalanceByAddress = {};

		Object.entries(avgBalancesByAddress).forEach(([walletAddress, assets]) => {
			if (!(walletAddress in effectiveUSDBalanceByAddress)) effectiveUSDBalanceByAddress[walletAddress] = 0;
			if (!(walletAddress in effectiveBalances)) effectiveBalances[walletAddress] = [];

			assets.forEach(({ effective_usd_balance, home_asset, home_symbol, effective_balance, balance }) => {
				effectiveUSDBalanceByAddress[walletAddress] += effective_usd_balance;

				const index = effectiveBalances[walletAddress].findIndex(({ asset }) => asset === home_asset);

				if (index >= 0) {
					effectiveBalances[walletAddress][index].effective_balance += effective_balance;
					effectiveBalances[walletAddress][index].balance += balance;
					effectiveBalances[walletAddress][index].effective_usd_balance += effective_usd_balance;
				} else {
					effectiveBalances[walletAddress].push({
						asset: home_asset,
						symbol: home_symbol,
						effective_balance,
						balance,
						effective_usd_balance
					});
				}
			});
		});

		return await fetch(`${this.endpointUrl}/rewards/${period}`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data).then(async (data) => { // for test [{ address: "KUNNTFAD3G55IWXSNKTDRKH222E4DF7R", share: 0.094, reward: 1e9 }]
			const total = [];

			return [data.rewards.map(({ reward, ...row }) => ({ ...row, reward: (reward / 1e9) * gbytePrice, total_effective_usd_balance: effectiveUSDBalanceByAddress[row.address], effective_balances: effectiveBalances[row.address] })), total];
		});
	}
}

export const getMonthName = (num) => {
	const names = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	return names[num - 1];
}

export default new Backend(appConfig.BACKEND_URL);
