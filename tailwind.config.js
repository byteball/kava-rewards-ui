const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				kava: "#FC4D3C",
				"primary-gray": "#11151C"// bittrex
			},
			screens: {
				...defaultTheme.screens,
				xs: "440px",
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};
