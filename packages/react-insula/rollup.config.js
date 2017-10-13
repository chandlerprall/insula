import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/index.js',
    format: 'cjs',
    dest: 'build/react-insula.js',
    plugins: [babel({
        include: 'src/**/*.js',
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
            ['es2015', {modules: false}],
            'react',
        ],
        plugins: ['external-helpers'],
    })],
};