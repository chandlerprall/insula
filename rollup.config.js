import noderesolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/Store.js',
    format: 'cjs',
    dest: 'build/insula.js',
    plugins: [
        noderesolve(),
        commonjs(),
    ],
};