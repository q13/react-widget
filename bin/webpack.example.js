/**
 * 打包脚本
 * @param  {[type]} "webpack" [description]
 * @return {[type]}           [description]
 */
var webpack = require("webpack"),
    path = require("path"),
    fs = require("fs"),
    fsExtra = require("fs-extra"),
    walk = require("walk"),
    MemoryFS = require("memory-fs");

var HappyPack = require('happypack');

const SRC_PATH = path.normalize(__dirname + "/../example/script");
// const OUTPUT_PATH = path.normalize(__dirname + "/../example/dist");

var fileList = [];

// 获得入口集合
function getEntry(dir){  
    var dirList = fs.readdirSync(dir);
    dirList.forEach(function(item){
        if(/asset/g.test(item)) return;
        if(fs.statSync(dir + '/' + item).isDirectory()){
            getEntry(dir + '/' + item);
        }else{
            fileList.push(dir + '/' + item);
        }
    });
    return fileList.filter(function (filePath) {
        return path.extname(filePath) === ".js";
    })
}

// 获取入口obj
const entryObj = {};
getEntry(SRC_PATH).forEach(filePath => {
    entryObj[path.parse(filePath).name] = filePath;
})

const config = {
    entry: entryObj,
    context: SRC_PATH,

    output: {
        path: path.join(__dirname, '/../example/dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
        // chunkFilename: "[id].js"
    },

    module: {
        rules: [{
            test: /\.css$/,
            use: [
                "style-loader",
                "css-loader?sourceMap",
                "postcss-loader"
            ]
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components|asset)/,
            // loaders:[ 'happypack/loader' ]
            use: [{
                loader: 'babel-loader?cacheDirectory',
                options: {
                    presets: [["es2015",{"modules": false}], "react", "stage-0"]
                }
            }]
        }, {
            test: /\.(gif|png|svg|jpe?g)(\?.*)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10240, //10k下图片data url
                    name: "image/[hash].[ext]"
                }
            }                    
        }]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'Build at ' + new Date() + '\nBy~雅座前端开发组', 
            entryOnly: true
        }),
        // new HappyPack({
        //     loaders: [{
        //         path: 'babel-loader',
        //         query: {
        //             // plugins: [
        //             // 'transform-runtime',
        //             // ],
        //             presets: [[ 'es2015', { modules: false }], 'react', 'stage-0'],
        //             cacheDirectory: false
        //         }
        //     }]
        // })
        // 压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ],

    // 开发server
    devServer: {
        port: 1318,
        host: '127.0.0.1',
        historyApiFallback: true,
        noInfo: false,
        stats: 'minimal',
        inline: true, //监控js变化
        // hot:true,
        contentBase:path.join(__dirname + "/../example")
    }
}

if(process.env.NODE_ENV == "development") {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    );
    config.devtool = "cheap-module-eval-source-map";
}
module.exports = config;