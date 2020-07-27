grammar Math;

/**
 * Entry for either an equation or an expression.
 */
expression_or_equation
    : expression
    | equation;

/**
 * entry for an equation.
 */
equation
    : expression EQUAL expression;

/**
 * entry for an expression.
 */
expression
    : (NUMBER | INT)     # Number_
    | CONSTANT           # Constant_
    | call               # Call_
    | ID                 # Id_
    | abs                # Abs_
    | '(' expression ')' # Paren_
    | '[' expression ']' # Paren_
    | '{' expression '}' # Paren_
    | expression expression # Implicit_Multiply_
    | MINUS expression   # Negate_
    | ID '_' (ID | INT)  # Subscript_
    | <assoc=right>left=expression operator=EXP right=expression    # Infix_
    | left=expression operator=TIMES right=expression  # Infix_
    | left=expression operator=DIVIDE right=expression # Infix_
    | left=expression operator=PLUS right=expression   # Infix_
    | left=expression operator=MINUS right=expression  # Infix_
    ;

abs
    : '|' expression '|';

call
    : prefix expression
    | ID '(' expression ')'
    ;

prefix
    : SIN | COS | TAN | COT | SEC | CSC | ASIN | ACOS | ATAN | ACOT | ASEC | ACSC | LN
    | SINH | COSH | TANH | COTH | SECH | CSCH | ASINH | ACOSH | ATANH | ACOTH | ASECH | ACSCH;

infix
    : PLUS | MINUS | TIMES | DIVIDE | EXP;

INT
   : ('0'..'9')+;

NUMBER
   : ('0' .. '9') + ('.' ('0' .. '9') +)?
   ;

PLUS
   : '+';
MINUS
   : '-';

TIMES
   : '*';

DIVIDE
   : '/';

EXP
   : '^' | '**';

EQUAL
   : '=';

SIN
  : 'sin';
COS
  : 'cos';
TAN
  : 'tan';
COT
  : 'cot';
SEC
  : 'sec';
CSC
  : 'csc';
ASIN
  : 'asin';
ACOS
  : 'acos';
ATAN
  : 'atan';
ACOT
  : 'acot';
ASEC
  : 'asec';
ACSC
  : 'acsc';
SINH
  : 'sinh';
COSH
  : 'cosh';
TANH
  : 'tanh';
COTH
  : 'coth';
SECH
  : 'sech';
CSCH
  : 'csch';
ASINH
  : 'asinh';
ACOSH
  : 'acosh';
ATANH
  : 'atanh';
ACOTH
  : 'acoth';
ASECH
  : 'asech';
ACSCH
  : 'acsch';
LN
  : 'ln';

CONSTANT
  : [𝝉τ𝜏𝛕𝞽] | 'tau' | [π𝛑𝜋𝝅𝝿] | 'pi' | [𝑒e] | [𝑖i];

ID:
  ('a' .. 'z' | 'A' .. 'Z' )+
  ;

WS : (' ' | '\t' | '\n')+ -> channel(HIDDEN);
