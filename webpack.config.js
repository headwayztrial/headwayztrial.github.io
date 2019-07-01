var webpack = require('webpack'),
	ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
	// your root file
	entry: './src/index.js',

	// output JS bundle to: dist/main.js
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js'
	},

	resolve: {
		// you can load named modules from any dirs you want.
		// attempts to find them in the specified order.
		modules: [
			'./src/lib',
			'node_modules'
		]
	},

	module: {
		// you can tell webpack to avoid parsing for dependencies in any files matching an Array of regex patterns
		noParse: [
			/(node_modules|~)\/(crappy\-bundled\-lib|jquery)\//gi
		],

		rules: [
			// before hitting the actual loaders, load any sourcemaps specified by npm modules
			{
				test: /\.js$/,
				use: 'source-map-loader',
				enforce: "pre", 
			},
			// transpile ES6/7 to ES5 via babel
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			// bundle LESS and CSS into a single CSS file, auto-generating -vendor-prefixes
			{
				test: /\.(less|css)$/,
				exclude: /\b(some\-css\-framework|whatever)\b/i,
				loader: ExtractTextPlugin.extract("style?sourceMap", "css?sourceMap!autoprefixer?browsers=last 2 version!less")
			}
		]
	},

	plugins: ([
		// Avoid publishing files when compilation failed:
		new webpack.NoEmitOnErrorsPlugin(),

		// Write out CSS bundle to its own file:
		new ExtractTextPlugin('style.css', { allChunks: true })
	]).concat(process.env.WEBPACK_ENV==='dev' ? [] : [
		new webpack.optimize.OccurrenceOrderPlugin(),

	]),

	optimization: {
		minimizer: [
			// minify the JS bundle
			new TerserPlugin({
				terserOptions: {
					output: { comments: false },
				},
				exclude: [ /\.min\.js$/gi ]		// skip pre-minified libs
			})
		],
	},

	// Pretty terminal output
	stats: { colors: true },

	// Generate external sourcemaps for the JS & CSS bundles
	devtool: 'source-map',

	// `webpack-dev-server` spawns a live-reloading HTTP server for your project.
	devServer: {
		port: process.env.PORT || 8080,
		contentBase: './src',
		historyApiFallback: true
	}
};