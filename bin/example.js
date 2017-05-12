"use strict";
/**
 * 打包脚本
 * @param  {[type]} "webpack" [description]
 * @return {[type]}           [description]
 */
var webpack = require("webpack"),
    path = require("path"),
    fs = require("fs"),
    fsExtra = require("fs-extra"),
    MemoryFS = require("memory-fs");

const SRC_PATH = path.normalize(__dirname + "/../example/script");
const OUTPUT_PATH = path.normalize(__dirname + "/../example/dist");


function main() {
    //先移除dist目录
    //fsExtra.removeSync(OUTPUT_PATH);
    //重新创建
    //fsExtra.mkdirpSync(OUTPUT_PATH);
    //}
    //先清空dist目录
    //fsExtra.emptyDirSync(OUTPUT_PATH);
    //确保dist/image目录存在
    fsExtra.ensureDirSync(path.normalize(OUTPUT_PATH + "/image"));

    let memFs = new MemoryFS();
    
    (function exe(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        exe(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }(SRC_PATH, function(err, results) {
        let entry = {};
        results.filter(function (filePath) {
            return path.extname(filePath) === ".js";
        }).forEach(function (filePath) {
            entry[path.basename(filePath, ".js")] = path.resolve(SRC_PATH, filePath); 
        });
        let config = {
            context: SRC_PATH,
            entry: entry,
            output: {
                path: OUTPUT_PATH,
                //publicPath: "/viewport/dist/",
                //publicPath: "",
                filename: "[name].js",
                chunkFilename: "[id].js"
            },
            "module": {
                rules: [{
                    test: /\.css$/,
                    // loader: "style!css?sourceMap!postcss",
                    use: [
                        "style-loader",
                        "css-loader",
                        "postcss-loader"
                    ]
                }, {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [{
                        loader: 'babel-loader',
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
                })
            ],
            // debug: true,
            devtool: "source-map"
            // plugins: [//开发环境开启sourceMap
            //     new UglifyJsPlugin({
            //         sourceMap: true
            //     })
            // ]
        };
        let compiler = webpack(config)
        compiler.outputFileSystem = memFs;
        compiler.watch({
            aggregateTimeout: 300 // wait so long for more changes
        }, function(err, stats) {
            if (err) {
                console.error(err + '\n');
            } else {
                let data = stats.toJson();
                if (data.errors.length) {
                    console.error(data.errors.toString() + '\n');
                } else {
                    if (data.warnings.length) {
                        console.warn(data.warnings.toString() + '\n');
                    }
                    (function exe(dir, done) {
                        var results = [];
                        memFs.readdir(dir, function(err, list) {
                            if (err) return done(err);
                            var pending = list.length;
                            if (!pending) return done(null, results);
                            list.forEach(function(file) {
                                file = path.resolve(dir, file);
                                memFs.stat(file, function(err, stat) {
                                    if (stat && stat.isDirectory()) {
                                        exe(file, function(err, res) {
                                            results = results.concat(res);
                                            if (!--pending) done(null, results);
                                        });
                                    } else {
                                        results.push(file);
                                        if (!--pending) done(null, results);
                                    }
                                });
                            });
                        });
                    }(OUTPUT_PATH, function(err, results) {
                        //console.log(results);
                        results.forEach(function(filePath) {
                            //copy到实际的存储
                            let fileExtName = path.extname(filePath);
                            let imageFilePath;
                            if (fileExtName === ".jpg" || fileExtName === ".jpeg" || fileExtName === ".png" || fileExtName === ".gif" || fileExtName === ".svg") {
                                imageFilePath = path.normalize(OUTPUT_PATH + "/image/" + path.basename(filePath));
                                if (!fs.existsSync(imageFilePath)) {
                                    fs.writeFileSync(imageFilePath, memFs.readFileSync(filePath), {
                                        "mode": 0o777
                                    });
                                    console.info("Info: " + imageFilePath + " build success!\n");
                                }
                            } else {
                                fs.writeFileSync(filePath, memFs.readFileSync(filePath), {
                                    "mode": 0o777
                                });
                                console.info("Info: " + filePath + " build success!\n");
                            }
                        });
                    }));
                }
            }
        });
    }));
}
main();
exports.main = main;
