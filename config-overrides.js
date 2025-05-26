const webpack = require('webpack');

module.exports = function override(config, env) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser"),
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify")
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"]
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]);
    config.module = {
        ...config.module,
        rules: [
            ...config.module.rules,
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    };

    // Отключаем source-map-loader для node_modules
    config.module.rules = config.module.rules.map(rule => {
        if (rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader')) {
            rule.exclude = /node_modules/;
        }
        return rule;
    });

    return config;
}; 