/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

import {ParserRuleContext} from "antlr4ts";
import {TreeNode} from './TreeNode';
import {Number_Context} from "../gen/MathParser";

/**
 * Number node
 */

 export class NumberNode extends TreeNode {
     value: number;
     constructor(ast: Number_Context | number) {
         super(typeof ast === 'number' ? undefined : ast);
         this.value = typeof ast === 'number'
             ? ast
             : Number.parseFloat(ast.text);
     }
}
