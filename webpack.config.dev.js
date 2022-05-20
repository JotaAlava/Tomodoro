const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
	mode: 'development',
	target: 'web',
	devtool: 'cheap-module-source-map',
	entry: './src/index',
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: '[name].[contenthash].js'
	},
	devServer: {
		stats: 'minimal',
		overlay: true,
		historyApiFallback: true,
		disableHostCheck: true,
		headers: { 'Access-Control-Allow-Origin': '*' },
		https: false
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.API_URL': JSON.stringify(
				'https://b0yojzr0z1.execute-api.us-east-1.amazonaws.com/dev/'
			),
			'process.env.PRODUCT_ID': JSON.stringify(
				'5F27FC90-1F7A-11EC-B294-AB5D2B155148' // // ElPomodoro ProductId
			),
			'process.env.auth0Domain': JSON.stringify(
				'mostexpensivedeveloper-dev.us.auth0.com'
			),
			'process.env.auth0ClientId': JSON.stringify(
				'AXQ0Vf8OsgEc9pBgs6tAtWjPrRv4pwYG'
			),
			'process.env.auth0Audience': JSON.stringify(
				'https://mostexpensivedeveloper-dev.us.auth0.com/api/v2/'
			),
			'process.env.GA': JSON.stringify('G-5NE4871L3N'),
			'process.env.environment': JSON.stringify('dev')
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			favicon: 'src/favicon.ico'
		})
	],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			},
			{
				test: /(\.css)$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: { name: '[name].[ext]' }
					}
				]
			}
		]
	}
};
