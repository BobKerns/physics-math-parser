/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

import {Operator2} from "./Operator";

/**
 * Addition expression operator
 */

class PlusOp implements Operator2 {
     eval(l: number, r: number) { return l + r; }
}

export const Plus = new PlusOp();

