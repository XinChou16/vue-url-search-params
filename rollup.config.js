import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const banner = `
/**
 * vue-url-search-params v${pkg.version}
 * (c) ${new Date().getFullYear()} Xin Zhou
 * @license MIT
 */
`;
const outputName = 'vue-url-search-params';
const globalName = 'vueUrlSearchParams';


const configs = [
    {
        file: `dist/${outputName}.esm-browser.js`,
        format: 'es',
        browser: true,
        env: 'development'
    },
    {
        file: `dist/${outputName}.esm-browser.min.js`,
        format: 'es',
        browser: true,
        minify: true,
        env: 'production'
    },
    {
        file: `dist/${outputName}.global.js`,
        format: 'iife',
        env: 'development'
    },
    {
        file: `dist/${outputName}.global.min.js`,
        format: 'iife',
        minify: true,
        env: 'production'
    },
    {
        file: `dist/${outputName}.umd.js`,
        format: 'umd',
        env: 'development'
    },
    {
        file: `dist/${outputName}.umd.min.js`,
        format: 'umd',
        minify: true,
        env: 'production'
    }
]

function createEntry(config) {
    const c = {
        input: 'src/index.ts',
        plugins: [
            resolve(),
            commonjs()
        ],
        output: {
            banner,
            file: config.file,
            format: config.format
        }
    };

    if (['iife', 'umd'].includes(config.format)) {
        c.output.name = globalName;
    }

    c.plugins.push(ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        tsconfigOverride: {
            compilerOptions: {
                declaration: config.format === 'es' && config.browser && config.env === 'development',
                target: ['iife', 'umd', 'cjs'].includes(config.format) ? 'es5' : 'es2018'
            }
        }
    }));

    if (config.minify) {
        c.plugins.push(terser({
            module: config.format === 'es'
        }));
    }

    return c;
}

function createEntries() {
    return configs.map(c => createEntry(c));
}

export default createEntries();
