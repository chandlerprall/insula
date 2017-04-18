import babel from 'rollup-plugin-babel';
import noderesolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
    format: 'umd',
    moduleName: 'exampleApp',
    plugins: [
        replace({'process.env.NODE_ENV': '"development"'}),
        babel({
            include: '**/*.js',
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
                ['es2015', {modules: false}],
                'react',
            ],
            plugins: ['external-helpers'],
        }),
        noderesolve(),
        commonjs({
            namedExports: {
                'react': [
                    'Component'
                ],
                'node_modules/prop-types/index.js': [
                    'any',
                    'array',
                    'arrayOf',
                    'bool',
                    'checkPropTypes',
                    'element',
                    'func',
                    'instanceOf',
                    'node',
                    'number',
                    'object',
                    'objectOf',
                    'oneOf',
                    'oneOfType',
                    'shape',
                    'string',
                    'PropTypes',
                ],
            },
        }),
    ],
};