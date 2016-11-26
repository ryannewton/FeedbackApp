module.exports = {
	entry: {
		'./public/bundle': './src/index',
		'./background': './src/chrome/background_src'
	},
	output: {
		path: './',
		filename: '[name].js'
	},
	module: {
		loaders: [{
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['react', 'es2015', 'stage-1']
			}
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	devServer: {
		historyApiFallback: true,
		contentBase: './'
	}
};
