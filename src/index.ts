/*
 * @module NpmRollupTemplate
 * Copyright 2020 by Bob Kerns. Licensed under MIT license.
 *
 * Github: https://github.com/BobKerns/npm-typescript-rollup-template
 */

/**
 * Load the full system with a single import.
 * @packageDocumentation
 * @preferred
 * @module Index
 */
import {CharStreams as xCharStreams, CommonTokenStream as xCommonTokenStream} from 'antlr4ts';
export const CharStreams = xCharStreams;
export const CommonTokenStream = xCommonTokenStream;

import {MathLexer} from './gen/MathLexer';
import {MathParser} from "./gen/MathParser";

export * from './gen/MathLexer';
export * from './gen/MathParser';
export * from './gen/MathListener';
export * from './gen/MathVisitor';

export function parse(str: string) {
    const stream = CharStreams.fromString(str);
    const lex = new MathLexer(stream);
    const tok = new CommonTokenStream(lex);
    const parser = new MathParser(tok);
    return parser.expression_or_equation();
}

