# py-wasm-try
Play around with Python + Pyodide + WebAssembly

I was trying to experiment using Pyodide and wordcloud packages.
- Pyodide - https://github.com/pyodide/pyodide
- Word Cloud - https://github.com/amueller/word_cloud

Pyodide brings the Python runtime and some popular libraries to the browser by compiling them to JS+WebAssembly. Pyodide also provides the toolchain and instructions to create a Pyodide package out of an existing 3rd party Python library.

In this project, the Pyodide toolchain has been used to generate a Pyodide package of the wordcloud package. The compiled JS+WebAssembly output files for wordcloud package are here:
- [wordcloud.data](https://github.com/ramprax/py-wasm-try/tree/master/packages/wordcloud.data)
- [wordcloud.js](https://github.com/ramprax/py-wasm-try/tree/master/packages/wordcloud.js)

After Pyodide is loaded in the browser, the wordcloud package is loaded and used for generating images.

See it in action here https://ramprax.github.io/py-wasm-try/
