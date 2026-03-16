# Assignment 05: GitHub Issues Tracker

## Project Overview

This project is a responsive GitHub-style issue tracker built with plain `HTML`, `CSS`, and `JavaScript`. It includes a demo login page, issue listing with category tabs, search functionality, a loading spinner, and a details modal for each issue.

## Features

- Demo login with predefined admin credentials
- Responsive issue tracker layout
- All, Open, and Closed issue tabs
- Search issues by keyword
- Loading spinner while fetching data
- Four-column card layout on large screens
- Issue details modal
- Different top border colors for open and closed issues

## API Endpoints

- All Issues: `https://phi-lab-server.vercel.app/api/v1/lab/issues`
- Single Issue: `https://phi-lab-server.vercel.app/api/v1/lab/issue/{id}`
- Search Issue: `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={searchText}`

## Demo Credentials

```text
Username: admin
Password: admin123
```

## Technologies Used

- HTML
- CSS
- JavaScript

## Required Questions

### 1. What is the difference between `var`, `let`, and `const`?

`var` is function-scoped and can be redeclared, which can create confusing bugs. `let` is block-scoped and can be updated, but it cannot be redeclared in the same scope. `const` is also block-scoped, but it must be assigned when declared and cannot be reassigned later.

### 2. What is the spread operator (`...`)?

The spread operator expands values from an array, object, or iterable into another array, object, or function call. It is commonly used to copy data, merge arrays or objects, and pass multiple values more cleanly.

### 3. What is the difference between `map()`, `filter()`, and `forEach()`?

`map()` creates a new array by changing every item based on a callback function. `filter()` creates a new array containing only the items that pass a condition. `forEach()` only runs a function on each item and does not return a new array for transformation.

### 4. What is an arrow function?

An arrow function is a shorter way to write a function in JavaScript. It is useful for concise code and it handles `this` differently from regular functions because it takes `this` from the surrounding scope.

### 5. What are template literals?

Template literals are string values written with backticks. They allow variable interpolation using `${}` and support multi-line strings without using extra escape characters.

## Submission

- GitHub Repository Link: `Add your repository link here`
- Live Site Link: `Add your live site link here`
