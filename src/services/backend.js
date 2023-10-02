import { groupBy } from "lodash";

import appConfig from "appConfig";

class Backend {
	constructor(endpointUrl) {
		this.endpointUrl = endpointUrl;
	}

	async getEstimatedSnapshot() {
		const avgBalances = await fetch(`${this.endpointUrl}/average_balances/latest`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data);

		const totalEffectiveUsdBalance = avgBalances.reduce((acc, { effective_usd_balance }) => acc + effective_usd_balance, 0);

		return ({
			balances: avgBalances,
			total_effective_usd_balance: totalEffectiveUsdBalance
		});
	}

	async getPeriods() {
		const date = new Date();

		const defaultPeriods = [{ value: 'estimated', title: `${getMonthName(date.getMonth() + 1)} (estimated)` }];

		const periodsData = await fetch(`${this.endpointUrl}/periods`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data);

		// [...periodsData, { period: '2023-05' }] for test
		const loadedPeriods = periodsData.map(({ period }) => {
			const [year, month] = period.split("-");

			return ({
				value: period,
				title: `${getMonthName(month)} ${year}`
			})
		});

		return [...defaultPeriods, ...loadedPeriods];
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
		const avgBalances = await this.getAvgBalancesByPeriod(period);
		const avgBalancesByAddress = groupBy(avgBalances, (b) => b.address.toUpperCase());
		const gbytePrice = await this.getGbytePrice();
		const effectiveBalances = {};
		const effectiveUSDBalanceByAddress = {};

		Object.entries(avgBalancesByAddress).forEach(([walletAddress, assets]) => {
			if (!(walletAddress in effectiveUSDBalanceByAddress)) effectiveUSDBalanceByAddress[walletAddress] = 0;
			if (!(walletAddress in effectiveBalances)) effectiveBalances[walletAddress] = [];

			assets.forEach(({ effective_usd_balance, home_asset, home_symbol, effective_balance, balance }) => {
				effectiveUSDBalanceByAddress[walletAddress] += effective_usd_balance;

				effectiveBalances[walletAddress].push({
					asset: home_asset,
					symbol: home_symbol,
					effective_balance,
					balance,
					effective_usd_balance
				});
			});
		});

		return await fetch(`${this.endpointUrl}/rewards/${period}`, {
			method: "GET",
			cache: "no-cache"
		}).then(r => r.json()).then(r => r.data).then(async (data) => { // for test [{ address: "KUNNTFAD3G55IWXSNKTDRKH222E4DF7R", share: 0.094, reward: 1e9 }]
			const total = [];
			return [data.map(({ reward, ...row }) => ({ ...row, reward: (reward / 1e9) * gbytePrice, total_effective_usd_balance: effectiveUSDBalanceByAddress[row.address], effective_balances: effectiveBalances[row.address] })), total];
		});
	}
}

const getMonthName = (num) => {
	const names = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];

	return names[num - 1];
}

export default new Backend(appConfig.BACKEND_URL);
