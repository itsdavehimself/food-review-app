module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'prettier/prettier': 'error',
		indent: ['error', 2],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
