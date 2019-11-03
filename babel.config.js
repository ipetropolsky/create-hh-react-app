module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: false,
                helpers: true,
                useESModules: true,
            },
        ],
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
                exclude: [
                    'es.weak-map',
                    'es.weak-set',
                    'es.array-buffer.*',
                    'es.data-view',
                    'es.typed-array.*',
                    'es.reflect.*',
                ],
            },
        ],
        '@babel/preset-react',
    ],
};
