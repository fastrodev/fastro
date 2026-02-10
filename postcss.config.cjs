module.exports = {
    plugins: [
        require('autoprefixer'),
        require('@tailwindcss/postcss'),
        require('cssnano')({ preset: 'default' }),
    ],
};
