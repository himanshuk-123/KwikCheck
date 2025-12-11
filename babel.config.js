module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			
			[
				'module-resolver',
				{
					alias: {
						'@assets': './src/assets',
						'@constants': './src/constants/',
					},
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			],
			'react-native-reanimated/plugin',
		],
	};
};
