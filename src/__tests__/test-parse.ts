/**
 * @module physics-math-parser
 * Copyright ©  by Bob Kerns. Licensed under MIT license
 */

/**
 * Test the parser.
 */

import {parse} from "../index";

describe('Parse', () => {
    test('integer', () =>
        expect(((parse('7').expression() as any).INT()).text)
            .toEqual('7'));
    test('float', () =>
        expect(((parse('3.78').expression() as any).NUMBER()).text)
            .toEqual('3.78'));
    const foo = parse('3.78 + 9').expression();
    test('infix', () =>
        expect(((foo as any))._operator.text)
            .toEqual('+'));

});
