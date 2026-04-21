# localmockdb Todo Tool Demo

A compact mobile-first Todo Tool built with **React + localmockdb**.

This project is a **working example** of how to use the [`localmockdb` npm package](https://www.npmjs.com/package/localmockdb) to build a real frontend app without waiting for a backend.

## Live Links

- **NPM Package:** https://www.npmjs.com/package/localmockdb
- **Demo Link:** https://shrikant9907.github.io/localmockdb-demo/

---

## About localmockdb

`localmockdb` is a simple mock REST API package for frontend developers and beginners.

It helps you build and test frontend apps with API-like calls such as:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

Instead of waiting for a real backend, you can use `localmockdb` and keep moving with your frontend work.

It stores data in **localStorage**, so your data stays even after page refresh.

---

## Why it is easy for beginners

`localmockdb` is beginner-friendly because:

- no backend setup is required
- no database setup is required
- works with simple API-like methods
- easy to understand response structure
- good for learning CRUD operations
- perfect for React, Next.js, and similar frontend apps

This makes it very useful for:
- frontend practice
- UI development
- demos
- prototypes
- learning projects
- testing app flows before backend is ready

---

## About this demo

This repo is a **working Todo Tool demo** built using `localmockdb`.

It shows how you can create a simple and usable mobile-first tool UI while using `localmockdb` as the mock backend.

This demo focuses on a practical Todo app flow instead of only showing basic API examples.

---

## What this demo includes

- tool-style UI instead of website-style layout
- mobile-first layout
- add task modal
- edit task modal
- delete confirmation modal
- reset confirmation flow
- localStorage starts empty on first load
- demo data can be seeded manually only when needed
- full CRUD flow using localmockdb
- package responses visible in-app for testing and learning

---

## Features tested in this demo

This demo shows how to use `localmockdb` for:

- create todo
- list todos
- get single todo
- replace todo with `PUT`
- update fields with `PATCH`
- delete todo
- clear collection
- reset database
- pagination
- localStorage persistence

---

## Install the package

```bash
npm install localmockdb
```

---

## Basic usage

```ts
import { createAPI } from "localmockdb";

const db = createAPI();

// Create
await db.post("/todos", {
  title: "Learn localmockdb",
  completed: false
});

// Read all
await db.get("/todos");

// Read one
await db.get("/todos/1");

// Update part of record
await db.patch("/todos/1", {
  completed: true
});

// Replace full record
await db.put("/todos/1", {
  title: "Learn localmockdb properly",
  completed: true
});

// Delete
await db.delete("/todos/1");
```

---

## How this demo uses localmockdb

In this project, `localmockdb` is used like a small frontend-only backend.

The app creates a database instance and uses it to manage todos with real CRUD-style calls.

Example idea:

```ts
import { createAPI } from "localmockdb";

export const db = createAPI();
```

Then inside the app:

```ts
await db.post("/todos", { title: "My Task", completed: false });
await db.get("/todos");
await db.patch("/todos/1", { completed: true });
await db.delete("/todos/1");
```

This makes the app feel like it is connected to a real API, while staying fully frontend-only.

---

## Use cases

`localmockdb` is useful for:

- building frontend before backend is ready
- learning CRUD in React or Next.js
- creating quick prototypes
- testing forms and UI states
- creating demo projects
- teaching frontend API handling
- building local tools with persistent mock data

---

## Run this demo locally

```bash
npm install
npm run dev
```

---

## Build this demo

```bash
npm run build
```

---

## Deploy this demo

```bash
npm run deploy
```

---

## Who should use this?

This package and demo are great for:

- beginners learning frontend
- React developers
- Next.js developers
- frontend interview practice
- developers building MVPs
- anyone who wants to build first without waiting for APIs

---

## Summary

If you want to build frontend apps faster without waiting for backend work, `localmockdb` makes that simple.

And this Todo Tool demo is a practical example of how to use it in a real app.

---

## License

MIT
