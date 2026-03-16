
1. What is the difference between 'var', 'let', and 'const'?

'var' is function-scoped and can be redeclared, which can create confusing bugs.
'let' is block-scoped and can be updated, but it cannot be redeclared in the same scope.
'const' is also block-scoped, but it must be assigned when declared and cannot be reassigned later.

2.What is the spread operator ('...')?

The spread operator expands values from an array, object, or iterable into another array, object, or function call. It is commonly used to copy data, merge arrays or objects, and pass multiple values more cleanly.

3. What is the difference between 'map()', 'filter()', and 'forEach()'?

'map()' creates a new array by changing every item based on a callback function.
'filter()' creates a new array containing only the items that pass a condition.
'forEach()' only runs a function on each item and does not return a new array for transformation.

4. What is an arrow function?

An arrow function is a shorter way to write a function in JavaScript. It is useful for concise code and it handles this differently from regular functions because it takes this from the surrounding scope.

5. What are template literals?

Template literals are string values written with backticks. They allow variable interpolation using '${}' and support multi-line strings without using extra escape characters.
