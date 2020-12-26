/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

import {ParserRuleContext} from "antlr4ts";
import {MathParser} from "../gen/MathParser";
import {TreeNode} from './TreeNode';
import {NumberNode} from "./NumberNode";
import {Operator, Plus} from "../operators";
import {InfixNode} from "./InfixNode";

/**
 * Import an antlr4ts parse tree.
 */

export class Import {
    static types: {[k: number]: (new<C extends ParserRuleContext>(ast: C|any) => TreeNode)} = {
        [MathParser.NUMBER]: NumberNode,
        [MathParser.RULE_infix]: InfixNode
    };
    static operators: {[k: number]: Operator} = {
        [MathParser.PLUS]: Plus
    }
    static import(ast: ParserRuleContext) {
        const type = Import.types[ast.ruleIndex];
        if (type) {
            return new type(ast);
        }
        throw new Error(`Syntax error: ${ast.text}`);
    }
}
