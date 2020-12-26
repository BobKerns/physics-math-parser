/**
 * @module NpmTemplate
 * Copyright 2020 by Bob Kerns. Licensed under MIT license.
 */

/**
 * A largely self-configuring rollup configuration.
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import {terser} from 'rollup-plugin-terser';
import visualizerNoName, {VisualizerOptions} from 'rollup-plugin-visualizer';
import {OutputOptions, RollupOptions, Plugin} from "rollup";
import {chain as flatMap} from 'ramda';
import externalGlobals from "rollup-plugin-external-globals";
import serve from "rollup-plugin-serve";
import polyfills from 'rollup-plugin-node-polyfills';
import path from 'path';
import fsx from 'fs';
const fs = fsx.promises;

/**
 * The visualizer plugin fails to set the plugin name. We wrap it to remedy that.
 * @param opts
 */
const visualizer = (opts?: Partial<VisualizerOptions>): Plugin => {
    const noname: Partial<Plugin> = visualizerNoName(opts);
    return {
        name: "Visualizer",
        ...noname
    };
}

const mode = process.env.NODE_ENV;
// noinspection JSUnusedLocalSymbols
const dev = mode !== 'production';
const serve_mode = process.env.SERVE && dev;
const serve_doc = process.env.SERVE_DOC && serve_mode;

/**
 * Avoid non-support of ?. optional chaining.
 */
const DISABLE_TERSER = true;

/**
 * A rough description of the contents of [[package.json]].
 */
interface Package {
    name: string;
    main?: string;
    module?: string;
    browser?: string;
    [K: string]: any;
}
const pkg: Package  = require('../package.json');

/**
 * Compute the list of outputs from [[package.json]]'s fields
 * @param p the [[package.json]] declaration
 */
export const outputs = (p: Package) => flatMap((e: OutputOptions) => (e.file ? [e] : []),
    [
        {
            file: p.browser,
            name: p.name,
            format: 'umd',
            sourcemap: true,
            globals: {
                katex: "katex",
                d3: "d3",
                "@observablehq/stdlib": "observablehq",
                antlr4ts: 'antlr4ts',
                'antlr4ts/Parser': 'antlr4ts.Parser',
                'antlr4ts/Lexer': 'antlr4ts.Lexer',
                'antlr4ts/Token': 'antlr4ts.Token',
                'antlr4ts/FailedPredicateException': 'antlr4ts.FailedPredicateException',
                'antlr4ts/NoViableAltException': 'antlr4ts.NoViableAltException',
                'antlr4ts/ParserRuleContext': 'antlr4ts.ParserRuleContext',
                'antlr4ts/RecognitionException': 'antlr4ts.RecognitionException',
                'antlr4ts/VocabularyImpl': 'antlr4ts.VocabularyImpl',
                'antlr4ts/misc/Utils': 'antlr4ts.misc.Utils',
                'antlr4ts/atn/ATN': 'antlr4ts.atn.ATN',
                'antlr4ts/atn/ATNDeserializer': 'antlr4ts.atn.ATNDeserializer',
                'antlr4ts/atn/ParserATNSimulator': 'antlr4ts.atn.ParserATNSimulator',
                'antlr4ts/atn/LexerATNSimulator': 'antlr4ts.atn.LexerATNSimulator'
                // "ramda": "ramda",
                // "gl-matrix": "glMatrix"
            }
        },
        {
            format: 'cjs',
            file: p.main,
            sourcemap: true
        },
        {
            format: 'esm',
            file: p.module,
            sourcemap: true
        }
    ]) as OutputOptions;

/**
 * Compute the set of main entrypoints from [[package.json]].
 * @param p The contents of [[package.json]]
 * @param entries A array of keys to check for entry points in [[package.json]].
 */
const mainFields = (p: Package, entries: string[]) =>
    flatMap((f: string) => (pkg[f] ? [f] : []) as ReadonlyArray<string>,
        entries);

/**
 * A useful little plugin to trace some of the behavior of rollup.
 */
const dbg: any = {name: 'dbg'};
['resolveId', 'load', 'transform', 'generateBundle', 'writeBundle'].forEach(
    f => dbg[f] = function (...args: any[]) {
        this.warn(`${f}: ${args.map((a: any) => JSON.stringify(a, null, 2)).join(', ')}`);
        return null;}
);

/**
 * Check for modules that should be considered external and not bundled directly.
 * By default, we consider those from node_modules to be external,
 * @param id
 * @param from
 * @param resolved
 */
const checkExternal = (id: string, from?: string, resolved?: boolean): boolean => {
    //process.stderr.write(`id = ${id}\n`);
    return /antlr4ts/.test(id);
}

const exists = async (file: string) => {
    try {
        await fs.access(file);
        return true;
    } catch (e) {
        return false;
    }
};

const resolveAntlr4ts: Plugin = {
    name: 'resolveAntler4ts',
    buildStart(options) {
        this.warn(`buildStart(${JSON.stringify(options)})`);
    },
    resolveFileUrl(options) { this.warn(`resolveFile(${JSON.stringify(options)})`); return null; },
    resolveDynamicImport(a, b) {
        this.warn(`resolveDynamicImport(${a}, ${b})`);
        return null;
    },
    async resolveId(source, importer) {
        const original = source;
        if (source.startsWith("\0")) {
            this.warn(`SKIP PRIVATE: resolveId(${source}, ${importer})`);
            return null;
        }
        if (importer && (source.startsWith('.') || source.indexOf('/') > 0)) {
            const root = path.dirname(importer.replace(/\/gen\//, '/node_modules'));
            source = path.join(root, `${source}.js`);
            this.warn(`RESOLVE: ${original} ${importer.replace(/\/gen\//, '/')} => ${source}`);
        }/*
                const subst =
                    (/antlr4ts$/.test(source) || (/antlr4ts\/[^\/]+/.test(source) && await fs.exists(source)))
                        ? 'build/src/antlr4ts/index.js'
                        : (/antlr4ts\/atn/.test(source) && await exists(source))
                        ? 'build/src/antlr4ts/atn/index.js'
                        : null;
                        */
        const subst = (/antlr4ts$|antlr4ts\//.test(source) && await exists(source)) ? source : null;
        if (subst) {
            this.warn(`SUBST: resolveId(${source}, ${importer}) => ${subst}`);
        } else {
            this.warn(`SKIP: resolveId(${source}, ${importer})`);
        }
        return subst;
    }
};

const options: RollupOptions = {
    input:'./build/src/index.js',
    output: outputs(pkg),
    external: checkExternal,
    plugins: [
        // resolveAntlr4ts,
        resolve({
            // Check for these in package.json
            mainFields: mainFields(pkg, ['module', 'main', 'browser'])
        }),
        /*
        ts({
             tsconfig: 'src/tsconfig.json',
             include: "src/*.ts"
         }),
       */
        commonjs({
            extensions: [".js"]
        }),
        polyfills({}) as unknown as Plugin,

        externalGlobals({
            // 'gl-matrix': "glMatrix",
            //'katex': 'katex',
            // 'ramda': 'ramda',
            'antlr4ts': 'antlr4ts',
            'antlr4ts/Parser': 'antlr4ts',
            'antlr4ts/Lexer': 'antlr4ts',
            'antlr4ts/Token': 'antlr4ts',
            'antlr4ts/FailedPredicateException': 'antlr4ts',
            'antlr4ts/NoViableAltException': 'antlr4ts',
            'antlr4ts/ParserRuleContext': 'antlr4ts',
            'antlr4ts/RecognitionException': 'antlr4ts',
            'antlr4ts/VocabularyImpl': 'antlr4ts',
            'antlr4ts/misc/Utils': 'antlr4ts.misc',
            'antlr4ts/atn/ATN': 'antlr4ts.atn',
            'antlr4ts/atn/ATNDeserializer': 'antlr4ts.atn',
            'antlr4ts/atn/ParserATNSimulator': 'antlr4ts.atn',
            'antlr4ts/atn/LexerATNSimulator': 'antlr4ts.atn'
        }),
        /*
        ...(!dev && !DISABLE_TERSER) ? [
            terser({
            module: true
        })
        ] : [],
         */
        visualizer({
            filename: "build/build-stats.html",
            title: "Build Stats"
        }),
        ...serve_mode ? [
            serve({
                open: !!serve_doc,
                verbose: true,
                port: 5000,
                contentBase: '',
                openPage: '/docs/api/index.html'
            })
        ] : []
    ]
};

// noinspection JSUnusedGlobalSymbols
export default options;
