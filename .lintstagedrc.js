module.exports = {
    '*.{js,jsx}': ['eslint --fix', 'git add'],
    '*.less': ['stylelint --fix', 'git add'],
    'package.json': "bash -c 'yarn install --frozen-lockfile'",
};
