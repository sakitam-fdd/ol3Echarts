const path = require("path")

module.exports = function () {
    return {
        name: 'plugin-overwrite-webpack',
        configureWebpack() {
            return {
                resolve: {
                    alias: {
                        "@src": path.resolve(__dirname, "src"),
                    },
                },
                module: {
                    rules: [
                        {
                            test: /\.m?js/,
                            resolve: {
                                fullySpecified: false
                            }
                        },
                    ],
                },
            };
        },
    };
};
