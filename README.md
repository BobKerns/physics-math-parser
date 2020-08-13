# Project physics-math-parser
Parser for math expressions. Part of the Newton's Spherical Cow physics project.

To make it load in [ObservableHQ](https://observablehq.com), we must first load the `antlr4ts` runtime like this:

~~~js
antlr4ts = {
  const baseURL = `https://bundle.run/antlr4ts@0.5.0-alpha.3`;
  const antlr4ts = await require(`${baseURL}`);
  antlr4ts.atn = await require(`${baseURL}/atn/index.js`);
  antlr4ts.misc = await require(`${baseURL}/misc/index.js`);
  antlr4ts.tree = await require(`${baseURL}/tree/index.js`);
  window.antlr4ts = antlr4ts;
  return antlr4ts;
}
~~~
and then explicitly reference to ensure it is loaded first, like this:
~~~js
M = antlr4ts && require(`http://localhost:5000/lib/umd/index.js}`)
~~~
