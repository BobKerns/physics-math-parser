/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

import {TreeNode} from "./TreeNode";
import {Operator2} from "../operators";
import {Infix_Context} from "../gen/MathParser";
import {Import} from "./Import";

/**
 * Infix operator node
 */

 export class InfixNode extends TreeNode {
     readonly op: Operator2;
     readonly left: TreeNode;
     readonly right: TreeNode;
     constructor(ast: Infix_Context|Operator2, left?: TreeNode, right?: TreeNode) {
         super(left ? undefined : ast as Infix_Context);
         if (left) {
             this.op = ast as Operator2;
             this.left = left;
             this.right = right!;
         } else {
             const ctx = ast as Infix_Context;
             this.op = Import.operators[ctx._operator.type];
             this.left = Import.import(ctx._left);
             this.right = Import.import(ctx._right);
         }
     }
}
