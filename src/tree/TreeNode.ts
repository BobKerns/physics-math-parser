/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

import {ParserRuleContext} from "antlr4ts/ParserRuleContext";

/**
 * TreeNode in the parsed tree.
 */

 export class TreeNode {
     readonly ast?: ParserRuleContext;
     constructor(ast?: ParserRuleContext) {
         this.ast = ast;
     }
}
