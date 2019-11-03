module.exports = {
    root: true,
    parser: 'babel-eslint',
    // https://github.com/hhru/eslint-config-hh
    extends: ['plugin:react/recommended', '@hh.ru/eslint-config', 'prettier', 'prettier/standard'],
    plugins: ['prettier', 'babel'],
    rules: {
        'prettier/prettier': ['error'],
        'import/extensions': ['error', 'never', { svg: 'always', less: 'always' }],
        'no-unused-expressions': 'off',
        'babel/no-unused-expressions': ['error', { allowShortCircuit: true }],
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: './webpack.config.js',
            },
        },
    },
};
