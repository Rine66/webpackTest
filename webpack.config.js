/*var webpack=require('webpack');

module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname,
        filename: "./dist/bundle.js"
    },
	plugins:[
    new webpack.BannerPlugin('菜鸟教程 webpack 实例22')
    ],
	
};*/

//另一种方式，效果一样
/*var webpack=require('webpack');
const path = require('path');
module.exports={
    //入口文件的配置项
    entry:{
        entry:'./src/entry.js'
    },
    //出口文件的配置项
    output:{
        //输出的路径，用了Node语法
        path:path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename:'bundle.js'
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{},
    //插件，用于生产模版和各项功能
    plugins:[
    new webpack.BannerPlugin('菜鸟教程 webpack 实例22')
    ],
    //配置webpack开发服务功能
    devServer:{}
}*/

//多入口、多出口配置;
//服务和热更新;
//CSS文件打包;
//配置JS压缩，打包；
//HTML文件的发布
//CSS中的图片处理（失败）
//CSS分离与图片路径处理
//处理HTML中的图片
//CSS进阶，Less文件的打包和分离
//CSS进阶：SASS文件的打包和分离
//CSS进阶：自动处理CSS3前缀
//CSS进阶：消除未使用的CSS
//给webpack增加babel支持

//打包后如何调试（已阅）
//开发和生产并行设置（已阅）
//webpack模块化配置
//优雅打包第三方类库(引入jQuery成功)
//watch的正确使用方法，webpack自动打包
//Json配置文件使用
//https://www.cnblogs.com/hezihao/p/8126094.html
const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const glob = require("glob");
const PruifyCSSPlugin = require("purifycss-webpack");
const webpack = require('webpack');
const entry = require('./webpack_config/entry_webpack.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
var website={
    publicPath:"http://localhost:8080/"
}
module.exports={
    //入口文件的配置项
    /*entry:{
        entry:'./src/entry.js',
        //这里我们又引入了一个入口文件
        entry2:'./src/entry2.js'
    },*/
	entry:entry.path,
    //出口文件的配置项
    output:{
        //输出的路径，用了Node语法
        path:path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename:'[name].js',
		publicPath:website.publicPath,
    },
    //模块：例如解读CSS,图片如何转换，压缩
	module:{
        rules: [
            /*{
              test: /\.css$/,
              //use: [ 'style-loader', 'css-loader' ]
			  use: [
				  'style-loader',
				  { loader: 'css-loader', options: { importLoaders: 1 } },
				  'postcss-loader'
				]
            },*/
			{
              test: /\.css$/,
              use: extractTextPlugin.extract({//分离
                fallback: "style-loader",
                //use: "css-loader",
				//use:['css-loader?importLoaders=1','postcss-loader','sass-loader'],//css3前缀
				use: [{loader:"css-loader",options:{importLoaders:1}},//css3前缀，另一种方式(不过会报红)
				"postcss-loader"
				]
              })
            },
			//{test: /.(png|jpg)$/, loader: 'url?limit=8192'}
			{
                test: /\.(png|jsp|gif)/,//打包图片失败，无法输出
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50,
						outputPath:'images/'
                    }
                }]
            },
			{
				test: /\.(htm|html)$/i,
				 use:[ 'html-withimg-loader'] 
			},
			{
				test: /\.less$/,
				/*use: [{
					   loader: "style-loader" 
					}, {
						loader: "css-loader" 
					}, {
						loader: "less-loader"
					}]*/  
				use:extractTextPlugin.extract({//分离
					use:[{
						loader:'css-loader'
					},{
						loader:'less-loader'
					}],
					fallback:'style-loader'
				})
			},
			{
				test: /\.scss/,
				/*use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'sass-loader'
				}]*/ 
				use: extractTextPlugin.extract({//分离
					use:[{
						loader:'css-loader'
						},{
						loader:'sass-loader'
					}],
					fallback:'style-loader'
				})
			},
			{
				test:/\.(jsx|js)$/,//给webpack增加babel支持,解析ES6
				use:{
					loader:'babel-loader',
					options:{
						presets:[
							"es2015","react"
						]
					}
				},
				//exclude:/node_modules/
			},
          ]
    },
    //插件，用于生产模版和各项功能
    plugins:[
		new webpack.ProvidePlugin({
			$:'jquery'
		}),
        //new uglify(),//压缩js
		new htmlPlugin({
			minify:{
				removeAttributeQuotes:true
			},
			hash:true,
			template:'./src/index.html'//这时会自动生成html页面
		 }),
		new extractTextPlugin("css/index.css"),//分离为css文件
		new PruifyCSSPlugin({//消除未使用的CSS（消除页面上没有引用的，注释的不算）
			paths:glob.sync(path.join(__dirname,'src/*.html'))//src下所有的html
		}),
		new webpack.BannerPlugin('hezihao版权所有！')//都加上注释
    ],
	//压缩CSS
	optimization: {
		minimizer: [new OptimizeCSSAssetsPlugin({})]
	},
    //配置webpack开发服务功能
     devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'localhost',
        compress:true,
        port:8080
    }, //  配置webpack服务
	watchOptions:{
		poll:1000,//监测修改的时间(ms)
		//aggregeateTimeout:500, //防止重复按键，500毫米内算按键一次
		ignored:/node_modules/,//不监测
	}
}