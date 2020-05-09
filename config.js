const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;
const publicPath = process.env.PUBLIC_PATH || '/build';
const useHMR = isDevelopment;

module.exports = {
    isDevelopment,
    isProduction,
    publicPath,
    useHMR,
};
