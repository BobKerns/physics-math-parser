/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

/**
 * Operator interface
 */

 export interface Operator {
     eval(...numbers: number[]): number;
}

export interface Operator1 extends Operator {
     eval(num: number): number;
}

export interface Operator2 extends Operator {
     eval(num1:number, num2: number): number;
}
