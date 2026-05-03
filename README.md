# SmartSet — Complete Developer Guide & Notebook

## Mobile View
<img width="120" height="64" alt="Image" src="https://github.com/user-attachments/assets/90c03446-65d4-4ecc-b8df-9d39c8c21034" />
<img width="239" height="296" alt="Image" src="https://github.com/user-attachments/assets/fe99e345-244f-4a8d-82df-c21b38f93ea9" />
<img width="237" height="301" alt="Image" src="https://github.com/user-attachments/assets/a77c09e8-5107-4dba-acf8-94bfaf04c125" />
<img width="244" height="351" alt="Image" src="https://github.com/user-attachments/assets/19e74d4b-569e-492d-a406-84fbd2b295d7" />
<img width="242" height="294" alt="Image" src="https://github.com/user-attachments/assets/16fbb224-fe29-4544-bd66-68fe1594971a" />
<img width="240" height="269" alt="Image" src="https://github.com/user-attachments/assets/06dcf4fe-79c7-4bf5-99cf-9421b707c7f4" />
<img width="241" height="340" alt="Image" src="https://github.com/user-attachments/assets/0d44b9c4-2abc-4990-894c-4c86d27d6f8d" />
<img width="240" height="299" alt="Image" src="https://github.com/user-attachments/assets/14e0a79e-1f5b-46cf-93a8-d01ba7d8a933" />
<img width="241" height="283" alt="Image" src="https://github.com/user-attachments/assets/278c978a-76f2-4f14-bbcd-bf9f239bcbdd" />
<img width="240" height="330" alt="Image" src="https://github.com/user-attachments/assets/4824e2d5-ca97-4c40-8052-ad931f4868a3" />
<img width="243" height="350" alt="Image" src="https://github.com/user-attachments/assets/e502a578-26fb-493f-bcdf-2afdde52d8b8" />

## Table of Contents

1. [Project Overview](#1-project-overview)
   - [What is SmartSet?](#11-what-is-smartset)
   - [Why These Technology Choices?](#12-why-these-technology-choices)
   - [File Structure Overview](#13-file-structure-overview)
2. [App.jsx — The Application Root](#2-appjsx--the-application-root)
   - [What App.jsx Does](#21-what-appjsx-does)
   - [Provider Wrapping](#22-provider-wrapping--why-it-must-be-the-outermost-element)
   - [Layout: pb-20 and the Bottom Nav Problem](#23-layout-pb-20-and-the-bottom-nav-problem)
3. [Context.jsx — The Brain](#3-contextjsx--the-brain)
   - [Why Context API Instead of Props?](#31-why-context-api-instead-of-props)
   - [EXPENSE_CATEGORIES — Single Source of Truth](#32-expense_categories--the-single-source-of-truth)
   - [Seed Transactions](#33-seed-transactions--bootstrapping-the-app)
   - [useLocalStorage — The Custom Hook](#34-uselocalstorage--the-custom-hook)
   - [State Slices — What Gets Stored](#35-state-slices--what-gets-stored)
   - [Form State and Handlers](#36-form-state-and-handlers)
   - [Goal Management Functions](#37-goal-management-functions)
4. [Header.jsx — The Top Bar](#4-headerjsx--the-top-bar)
5. [Form.jsx — Add Transaction Modal](#5-formjsx--add-transaction-modal)
   - [Controlled Inputs](#51-controlled-inputs--the-react-way)
   - [The Type Selector Toggle Pattern](#52-the-type-selector--custom-toggle-pattern)
   - [Conditional Rendering](#53-conditional-rendering--isopen--)
   - [The Fixed Overlay Fix](#54-the-fixed-overlay-fix)
6. [BottomNav.jsx — Mobile Navigation](#6-bottomnavjsx--mobile-navigation)
   - [The Tabs Configuration Array](#61-the-tabs-configuration-array)
   - [NavLink vs Link](#62-navlink-vs-link--and-the-end-prop)
   - [Render Props Pattern for isActive](#63-render-props-pattern-for-isactive)
7. [Asset.jsx — The Dashboard](#7-assetjsx--the-dashboard)
   - [Month Key Derivation](#71-month-key-derivation)
   - [Total Balance Calculation](#72-total-balance--a-running-reduce)
   - [Percentage Change Logic](#73-percentage-change--month-over-month)
   - [The Badge Sub-Component](#74-the-badge-component--reusable-inline-ui)
   - [Budget Tracker Preview](#75-budget-tracker-preview)
   - [Recent Transactions Slice](#76-recent-transactions-slice)
8. [Transaction.jsx — The Full Ledger](#8-transactionjsx--the-full-ledger)
   - [Multi-Filter System](#81-the-multi-filter-system)
   - [useMemo for Performance](#82-usememo--performance-optimisation)
   - [Pagination Logic](#83-pagination-logic)
9. [Budgets.jsx — Budget Manager](#9-budgetsjsx--budget-manager)
   - [Reading the Budget Data Structure](#91-reading-the-budget-data-structure)
   - [Inline Editing Pattern](#92-inline-editing-pattern)
   - [Progress Bar Colour Logic](#93-progress-bar-colour-logic)
10. [Goals.jsx — Savings Goals](#10-goalsjsx--savings-goals)
    - [The Goal Data Model](#101-the-goal-data-model)
    - [Days Left Countdown](#102-days-left-countdown)
    - [Balance Validation Before Adding Funds](#103-balance-validation-before-adding-funds)
    - [One Active Funding Form at a Time](#104-one-active-funding-form-at-a-time)
11. [Architecture Summary](#11-architecture-summary)
    - [Data Flow](#111-data-flow-diagram)
    - [Key Design Decisions](#112-key-design-decisions-explained)
    - [What You Could Build Next](#113-what-you-could-build-next)

---

## 1. Project Overview

### 1.1 What is SmartSet?

SmartSet is a **personal finance management app** built entirely in the browser using React. It allows a user to:

- Record **income and expense transactions**
- Set **monthly budgets** per spending category
- Track **savings goals** with deadlines and progress

All of this happens without a backend server or database. Every piece of data is stored in the browser's **localStorage**, meaning it persists across page refreshes but stays completely private to the device.

The app is designed for a **Nigerian user context**: amounts are formatted in Naira (₦), the seed data contains realistic Nigerian bank account names (GTBank, Access Bank, Cowrywise), and the date range of seed transactions spans 2023–2026 to give the app meaningful data to display on the very first launch — so a brand-new user is never staring at a blank screen.

---

### 1.2 Why These Technology Choices?

Every technology in this project was chosen deliberately. Here is the reasoning:

| Technology | Why It Was Chosen |
|---|---|
| **React 18** | Component-based UI makes it easy to split the app into focused, reusable pieces. React's declarative model means the UI always reflects the current state automatically — you update state, React updates the screen. |
| **React Router v6** | Provides client-side routing (no page reloads) so we can have separate URLs for Home, Transactions, Budgets and Goals — making the app feel like a native mobile app while staying in the browser. |
| **Tailwind CSS** | Utility-first CSS lets us style components inline without writing separate CSS files. The design uses a carefully chosen earthy colour palette applied consistently via Tailwind's arbitrary value syntax, e.g. `bg-[#2A5C45]`. |
| **React Context API** | Rather than passing props 3–4 levels deep (prop drilling), Context gives every component direct access to shared state — transactions, budgets, goals, form state — without any intermediary components needing to know about it. |
| **localStorage** | A zero-dependency persistence layer. No backend, no API keys, no network needed. The custom `useLocalStorage` hook makes it as easy to use as `useState`. |
| **React Icons (Feather)** | The Feather icon set (`FiXxx`) is clean, minimal, and consistent — perfect for a finance app that wants to feel professional and trustworthy. |

---

### 1.3 File Structure Overview

The project has a simple, flat component structure. One context file acts as the global state store, and every other file is a React component:

```
src/
├── App.jsx             Root component; wires routing + layout
├── Context.jsx         Global state (transactions, budgets, goals)
└── components/
    ├── Header.jsx      Top bar with app title + add button
    ├── Form.jsx        Floating modal to add a transaction
    ├── BottomNav.jsx   Fixed mobile navigation bar
    ├── Asset.jsx       Home/Dashboard page
    ├── Transaction.jsx Full transaction ledger page
    ├── Budgets.jsx     Monthly budget manager page
    └── Goals.jsx       Savings goals page
```

> **Note:** `Routes.jsx` is present in the project but is empty — routing is handled directly inside `App.jsx` using React Router's `<Routes>` component.

---

## 2. App.jsx — The Application Root

> 📄 `src/App.jsx`

### 2.1 What App.jsx Does

`App.jsx` is the **entry point component** that React renders first. It has three critical responsibilities:

1. **Wraps the entire app** in `MyContextProvider` so every child component can access shared state.
2. **Defines the visual skeleton** of the page: a full-height flex column with a header at the top, a form overlay, a scrollable main area, and a fixed bottom nav.
3. **Declares all client-side routes** using React Router's `<Routes>` and `<Route>` components.

```jsx
// App.jsx — simplified to show the structure
return (
  <MyContextProvider>           {/* 1. State available everywhere */}
    <div className="min-h-screen bg-[#F5F3EE] flex flex-col pb-20">
      <Header />                {/* uses handleToggle from context */}
      <Form />                  {/* uses isOpen, formInput from context */}
      <main className="flex-1">
        <Routes>                {/* 3. Route declarations */}
          <Route path="/"             element={<Asset />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/budgets"      element={<Budgets />} />
          <Route path="/goal"         element={<Goals />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  </MyContextProvider>
);
```

---

### 2.2 Provider Wrapping — Why It Must Be the Outermost Element

The `MyContextProvider` wraps everything else. This is essential because React Context works on a **parent–child tree basis**: a component can only consume a context if its provider is somewhere *above* it in the component tree.

By placing the provider at the very top, every component in the app — Header, Form, BottomNav, Asset, Transaction, Budgets, Goals — can call `useContext(myContext)` and get instant access to shared state.

If you accidentally placed the provider *inside* a route component, only that route's children would have access to the context, and every other page would crash trying to destructure `undefined`.

---

### 2.3 Layout: pb-20 and the Bottom Nav Problem

The outer `div` has the class **`pb-20`** (padding-bottom: 5rem / 80px). This is a deliberate fix for a classic mobile layout problem:

- The `BottomNav` uses `position: fixed`, which **takes it out of the normal document flow**.
- This means the browser doesn't reserve any space for it — page content can scroll behind it and become hidden.
- `pb-20` reserves exactly enough space at the bottom so the last element on every page is always visible above the nav bar.

> This technique is used in every mobile app that has a fixed bottom navigation — from Twitter to Instagram to banking apps.

---

## 3. Context.jsx — The Brain

> 📄 `src/Context.jsx`

This is the most important file in the entire project. It manages all shared state, all business logic, and all data persistence. Everything else is just display.

### 3.1 Why Context API Instead of Props?

In React, data flows *down* through props. Without Context, to give the Goals page access to the list of transactions, you would need to thread them down like this:

```
App.jsx (has transactions)
  → passes to Routes
    → passes to Goals
      → finally uses it
```

This is called **prop drilling** and it causes two problems:
- Intermediate components (like Routes) get props they don't need and don't use.
- Renaming or changing a piece of state requires updating every component in the chain.

The Context API solves this by creating a **global store**. Any component anywhere in the tree can tap into it with `useContext(myContext)`. Context.jsx is where that store lives.

---

### 3.2 EXPENSE_CATEGORIES — The Single Source of Truth

```js
export const EXPENSE_CATEGORIES = [
  "groceries",
  "transport",
  "housing",
  "dining out",
  "utilities",
  "entertainment",
  "health",
  "education",
  "savings",
  "investment",
  "others",
];
```

This exported constant is used in **three different files**: `Form.jsx` (for the category dropdown), `Budgets.jsx` (to render all budget rows), and `Asset.jsx` (to calculate budget spending). 

This is the **DRY principle** (Don't Repeat Yourself) in action. If you ever need to add a new spending category, you change it in one place and every part of the app updates automatically. If you had typed the list out in three separate files, you'd risk inconsistencies and have to remember to update each one.

---

### 3.3 Seed Transactions — Bootstrapping the App

The `SEED_TRANSACTIONS` array contains 21 realistic transactions spanning 2023 to 2026. They serve as the **default value** for `localStorage` — a brand-new user sees a rich, meaningful dashboard on first launch instead of a blank screen.

Each transaction object follows this schema:

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Unique identifier (e.g. `TXN-2023-01-001`) |
| `type` | string | `'income'` or `'expense'` — drives colour coding and all math |
| `description` | string | Human-readable label shown in the UI |
| `amount` | number | Value in Nigerian Naira (₦) — always a plain number, no formatting |
| `date` | string | ISO format `YYYY-MM-DD` — used for month grouping |
| `category` | string | Must match one of `EXPENSE_CATEGORIES` (or `'income'`) |
| `account` | string | Which bank/wallet this transaction belongs to |
| `message` | string | Optional memo / internal note |

---

### 3.4 useLocalStorage — The Custom Hook

This is one of the most elegant pieces of the codebase. It is a custom React hook that **synchronises a piece of React state with localStorage** automatically, giving you the simple `useState` API but with persistence built in.

```js
function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      // If data exists in storage, use it; otherwise use the default
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue; // Handles JSON parse errors gracefully
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Fails silently if storage is full or unavailable
    }
  }, [key, state]); // Runs every time state changes

  return [state, setState]; // Identical API to useState
}
```

There are four key design decisions worth understanding here:

**1. Lazy initialiser in useState**  
The function passed to `useState(() => {...})` only runs **once on mount**. This is efficient — it reads from localStorage a single time rather than on every render. Without the lazy initialiser, you'd call `localStorage.getItem()` thousands of times as the user interacts with the app.

**2. JSON serialisation**  
`localStorage` only stores strings. `JSON.stringify` converts our arrays and objects to strings when saving; `JSON.parse` converts them back when loading. Without this, you'd save `[object Object]` instead of actual data.

**3. Try/catch everywhere**  
`localStorage` can throw exceptions in private/incognito browsing mode, when the storage quota is exceeded (~5MB), or in certain browser security configurations. The try/catch blocks prevent the entire app from crashing due to a storage issue.

**4. Same API as useState**  
The hook returns `[state, setState]`, so anywhere you call `useLocalStorage` you can use it exactly like `useState` — no new patterns to learn, no extra ceremony.

---

### 3.5 State Slices — What Gets Stored

The provider manages three persistent state slices, each with its own unique localStorage key:

```js
// Transactions: an array of transaction objects
const [transaction, setTransaction] = useLocalStorage(
  "smartset_transactions",
  SEED_TRANSACTIONS  // default: the 21 seed items
);

// Budgets: a nested object { monthKey: { category: amount } }
const [budgets, setBudgets] = useLocalStorage(
  "smartset_budgets",
  {}  // default: empty (no budgets set)
);

// Goals: an array of goal objects
const [goals, setGoals] = useLocalStorage(
  "smartset_goals",
  []  // default: empty (no goals)
);
```

The `budgets` object has a deliberately nested shape: `budgets[monthKey][category] = amount`. For example:

```js
{
  "2026-04": {
    "groceries": 50000,
    "transport": 20000,
    "utilities": 15000
  },
  "2026-05": {
    "groceries": 45000
  }
}
```

This design makes looking up a budget for any category in any month an **O(1) operation** — instant, no looping needed. It also naturally supports different budgets for different months without any extra logic.

---

### 3.6 Form State and Handlers

Unlike transactions, budgets and goals, the **form state is not persisted** to localStorage. It uses regular `useState` because it only needs to live for the duration of a single form interaction — there's no value in remembering a half-filled form across page refreshes.

```js
const [formInput, setFormInput] = useState({
  id: "",
  type: "",        // 'income' or 'expense'
  description: "",
  amount: "",
  date: "",
  category: "",
  account: "",
  message: "",     // Used for error messages, not user input
});
```

The `handleInput` handler uses the **controlled-input pattern**. Notice the special treatment for the `amount` field:

```js
const handleInput = (e) => {
  const { name, value } = e.target;
  // Parse amount to a number immediately; all other fields stay as strings
  const parsed = name === "amount" ? parseFloat(value) || "" : value;
  setFormInput({ ...formInput, [name]: parsed });
};
```

Why parse amount immediately? Because we need to do arithmetic with it later (adding to the transaction total). Storing it as a string and parsing at submission time would work but is error-prone. Storing it as a number from the start is cleaner.

The `handleSubmit` function validates all required fields before saving. If any field is empty, it sets `formInput.message` to an error string — `Form.jsx` renders that string below the buttons as feedback to the user. On success:

```js
const newTask = {
  ...formInput,
  id: Date.now(),                      // Unique timestamp ID
  amount: parseFloat(formInput.amount), // Ensure it's a number
};

setTransaction((prev) => [...prev, newTask]); // Functional updater pattern
```

The **functional updater** `(prev => [...prev, newTask])` is important. It guarantees we're working with the latest state value, avoiding a class of bugs called **stale closures** where the callback captures an outdated snapshot of state.

---

### 3.7 Goal Management Functions

Three functions manage goals, each demonstrating a key React state pattern:

**`addGoal`** — creates and appends a new goal:

```js
const addGoal = ({ name, targetAmount, targetDate }) => {
  const newGoal = {
    id: Date.now(),
    name: name.trim(),
    targetAmount: parseFloat(targetAmount),
    savedAmount: 0,          // Always starts at zero
    targetDate,
    createdAt: new Date().toISOString().split("T")[0],
  };
  setGoals((prev) => [...prev, newGoal]);
};
```

**`addFundsToGoal`** — the most sophisticated function. It does two things simultaneously: it updates the goal's `savedAmount` using `Array.map` (immutable update pattern), AND records a corresponding `savings` expense transaction:

```js
const addFundsToGoal = (goalId, amount) => {
  // Step 1: Update the matching goal's savedAmount (immutably)
  setGoals((prev) =>
    prev.map((g) =>
      g.id === goalId
        ? { ...g, savedAmount: g.savedAmount + parsed }
        : g  // All other goals unchanged
    )
  );

  // Step 2: Record it as a 'savings' expense transaction
  const goal = goals.find((g) => g.id === goalId);
  setTransaction((prev) => [
    ...prev,
    {
      id: Date.now(),
      type: "expense",
      description: `Savings: ${goal?.name || "Goal"}`,
      amount: parsed,
      date: new Date().toISOString().split("T")[0],
      category: "savings",
      account: "GTBank Current",
      message: "Goal contribution",
    },
  ]);
};
```

> **Why write to both?** Because the total balance on the Goals page is derived from the same `transaction` array used everywhere else. If goal contributions weren't recorded as transactions, adding ₦50,000 to a goal wouldn't reduce your displayed balance — the numbers would be inconsistent. This dual-write keeps everything in sync from a single source of truth.

**`deleteGoal`** — removes a goal by filtering it out:

```js
const deleteGoal = (goalId) =>
  setGoals((prev) => prev.filter((g) => g.id !== goalId));
```

`Array.filter` returns a new array excluding the matching goal. The original `goals` array is never mutated directly — this is the **immutability principle** that React depends on to detect changes and trigger re-renders.

---

## 4. Header.jsx — The Top Bar

> 📄 `src/components/Header.jsx`

`Header.jsx` is deliberately simple. It renders two things:
- The **app name** ("SmartSet") on the left
- A **+ button** and a **user avatar** on the right

The critical detail is that the + button calls `handleToggle` from context:

```jsx
const { handleToggle } = useContext(myContext);

<button>
  <FiPlus onClick={handleToggle} />
</button>
```

`handleToggle` flips the `isOpen` boolean in Context:

```js
const handleToggle = () => setIsOpen((prev) => !prev);
```

`Form.jsx` watches that same boolean and conditionally renders itself. This is a clean, **decoupled pattern**: Header doesn't know Form exists; it just updates a shared flag. Form doesn't know where the toggle came from; it just reads the flag.

> **Minor code quality note:** The `onClick` is placed on the `FiPlus` icon rather than on the `<button>` element. This works because click events bubble up through the DOM, but best practice is to put `onClick` on the button itself for accessibility (keyboard users, screen readers). It's a small thing worth correcting in future iterations.

---

## 5. Form.jsx — Add Transaction Modal

> 📄 `src/components/Form.jsx`

### 5.1 Controlled Inputs — The React Way

Every `<input>` and `<select>` in the form is a **controlled input**. This means:
- Its `value` comes from React state (`formInput.description`, etc.)
- Every keystroke calls `handleInput` to update that state
- React is always in control of what the input shows

```jsx
<input
  type="text"
  name="description"
  value={formInput.description}   // ← value FROM state
  onChange={handleInput}          // ← state updated ON every keystroke
/>
```

Compare this to an **uncontrolled input** where the DOM holds the value and you use a `ref` to read it on submit. Controlled inputs are preferred because:
- You can validate on every keystroke (show errors in real time)
- You can clear the form programmatically by resetting state to `""`
- The form value is always inspectable in React DevTools

---

### 5.2 The Type Selector — Custom Toggle Pattern

Instead of standard radio buttons for selecting income vs. expense, the form uses two styled `<p>` tags that act as toggles. The active type gets a coloured border applied via inline style:

```jsx
<p
  onClick={() => finType("expense")}
  style={{
    border:
      formInput.type === "expense"
        ? "3px solid #C0392B"   // Red border when this type is selected
        : "3px solid #E2DDD5",  // Grey border when inactive
  }}
>
  -Expense
</p>
```

This is an example of **derived visual state** — the border colour is not stored anywhere; it's calculated directly from `formInput.type` on every render. Clean and simple.

---

### 5.3 Conditional Rendering — `{isOpen && (...)}`

The entire form is wrapped in:

```jsx
{isOpen && (
  <div ...>form content</div>
)}
```

This is the standard React **short-circuit pattern** for conditional rendering. When `isOpen` is `false`, React evaluates `false && (...)` and renders nothing. When `isOpen` is `true`, the form appears.

This is more efficient than CSS `visibility: hidden` or `display: none` because the DOM element is **fully removed and re-created**, which also resets focus, scroll position, and any internal state — exactly what you want when closing and reopening a form.

---

### 5.4 The Fixed Overlay Fix

The original form used `position: relative` with negative `top` values. This was the source of the "content being pushed down" bug. Here's why:

- `position: relative` still participates in the **normal document flow**
- Even though the form visually shifts upward, its original "slot" remains in the layout
- Everything below gets pushed down by the form's full height

The fix is a **`position: fixed` full-screen overlay**:

```jsx
{isOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) handleToggle(); // Close on backdrop click
    }}
    style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
  >
    <form
      className="w-full max-w-md bg-white rounded-2xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent backdrop click from firing
    >
      {/* form fields */}
    </form>
  </div>
)}
```

Three things this achieves:
1. **`fixed inset-0`** — removes the overlay from document flow entirely. Zero layout impact.
2. **Dark semi-transparent backdrop** — standard modal UX. Clicking outside the form closes it.
3. **`max-h-[90vh] overflow-y-auto`** — on short screens (phones), the form scrolls internally rather than getting cut off at the bottom.

---

## 6. BottomNav.jsx — Mobile Navigation

> 📄 `src/components/BottomNav.jsx`

### 6.1 The Tabs Configuration Array

Rather than writing four separate `NavLink` elements with duplicated code, the component defines a **data array** and maps over it:

```js
const tabs = [
  { to: "/",             label: "Home",        Icon: FiHome   },
  { to: "/transactions", label: "Transactions", Icon: FiList   },
  { to: "/budgets",      label: "Budgets",      Icon: FiTarget },
  { to: "/goal",         label: "Goal",         Icon: FiFlag   },
];

// In JSX:
{tabs.map(({ to, label, Icon }) => (
  <NavLink to={to} key={to} ... />
))}
```

This is the **data-driven UI pattern**. Adding a fifth tab in the future requires only adding one object to the array — no JSX duplication, no risk of forgetting to copy an `onClick` handler.

---

### 6.2 NavLink vs Link — and the `end` Prop

React Router provides two components for navigation:

- **`<Link>`** — a basic anchor tag replacement. No active state awareness.
- **`<NavLink>`** — a smarter version that knows whether its route is currently active, providing an `isActive` boolean in its `className` callback.

The Home tab uses the special **`end`** prop:

```jsx
<NavLink to="/" end={to === "/"} ...>
```

Without `end`, the Home route (`path="/"`) would match **every single URL** in the app, because every path starts with `/`. So Home would always appear active regardless of which page you're on. The `end` prop tells React Router: *"only consider this active when the path is exactly `/`, not just when it starts with `/`."*

---

### 6.3 Render Props Pattern for isActive

`NavLink`'s `children` can be a function that receives `{ isActive }`. This component uses this pattern to conditionally apply styles:

```jsx
{({ isActive }) => (
  <>
    <span className={isActive ? "bg-[#EAF2EC] p-1.5 rounded-xl" : "p-1.5"}>
      <Icon strokeWidth={isActive ? 2.5 : 1.8} />
    </span>
    <span className="text-[10px] font-medium">{label}</span>
  </>
)}
```

Two visual changes happen on the active tab:
- A green background pill appears behind the icon
- The icon's `strokeWidth` increases from 1.8 to 2.5, making it appear **bolder**

This second detail is subtle but effective — it's the same visual trick used by iOS tab bars to indicate the active tab without needing a completely different icon.

---

## 7. Asset.jsx — The Dashboard

> 📄 `src/components/Asset.jsx`

This is the most calculation-heavy component. It derives multiple financial summaries from raw transaction data on every render.

### 7.1 Month Key Derivation

Many calculations group transactions by month. The `getMonthKey` helper converts any date string to a `"YYYY-MM"` string:

```js
const getMonthKey = (date) => {
  const d = new Date(date);
  // padStart(2, "0") ensures "2026-04" not "2026-4"
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
```

The "current month" is then derived as the **last item in a sorted array of all unique month keys**:

```js
const allMonthKeys = [
  ...new Set(transaction.map((tx) => getMonthKey(tx.date))),
].sort();

const currentMonthKey = allMonthKeys[allMonthKeys.length - 1]; // e.g. "2026-04"
const prevMonthKey    = allMonthKeys[allMonthKeys.length - 2]; // e.g. "2026-03"
```

This is **dynamic** — it always points to the most recent month that has any transaction data, regardless of the actual calendar date. This ensures the dashboard shows meaningful data even when viewing historical seed data.

---

### 7.2 Total Balance — A Running Reduce

The all-time total balance is a single `reduce` over every transaction:

```js
const totalAsset = transaction.reduce(
  (acc, tx) => tx.type === "income"
    ? acc + tx.amount   // Add income to the running total
    : acc - tx.amount,  // Subtract expenses from the running total
  0  // Starting value
);
```

`Array.reduce` takes each item one by one, applying the function and accumulating a result. Here the accumulator `acc` starts at `0` and grows or shrinks with each transaction. The final result is the net balance across all time.

---

### 7.3 Percentage Change — Month over Month

Every summary card shows how a metric changed compared to the previous month. The `pctChange` helper does this:

```js
const pctChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
```

The formula is: **((current - previous) / previous) × 100**

The edge case where `previous === 0` is critical. Without it, you'd compute `N / 0 = Infinity` or `0 / 0 = NaN` — both would cause React to render `"Infinity%"` or `"NaN%"` in the UI. The guard returns 100% if income appeared where there was none before, and 0% if both months had zero.

---

### 7.4 The Badge Component — Reusable Inline UI

`Asset.jsx` defines a local `Badge` sub-component that displays a colour-coded percentage change label. It accepts an `inverse` prop for expense metrics (where a decrease is good):

```jsx
const Badge = ({ value, inverse = false }) => {
  // For income/savings: going UP is good (green), going DOWN is bad (red)
  // For expenses: going DOWN is good (green), going UP is bad (red)
  const isGood = inverse ? value <= 0 : value >= 0;

  return (
    <span className={isGood
      ? "bg-[#EAF2EC] text-[#1E7A56]"  // Green
      : "bg-[#FDECEA] text-[#C0392B]"  // Red
    }>
      {fmtPct(value)} vs last month
    </span>
  );
};
```

This is an example of a **local sub-component** — a component defined inside another component's file because it's only ever used there. It keeps the JSX clean without requiring a dedicated file, while still encapsulating the logic.

---

### 7.5 Budget Tracker Preview

The dashboard shows a condensed view of the current month's budgets, with only the categories that actually have a budget set:

```js
// Only show categories that have a budget set this month
const budgetedCategories = EXPENSE_CATEGORIES.filter(
  (cat) => monthBudgets[cat]
);
```

Spending per category is calculated with `useMemo` to avoid recalculating on every render:

```js
const spendingByCategory = useMemo(() => {
  return transaction
    .filter((tx) => getMonthKey(tx.date) === currentMonthKey && tx.type === "expense")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});
}, [transaction, currentMonthKey]);
```

The result is an object like `{ groceries: 35000, transport: 9000 }` — a lookup table for instant access.

---

### 7.6 Recent Transactions Slice

The last section shows the 5 most recent transactions, sorted newest-first:

```js
const recentTransactions = useMemo(() => {
  return [...transaction]        // Spread to avoid mutating original array
    .sort((a, b) => new Date(b.date) - new Date(a.date))  // Newest first
    .slice(0, 5);                // Take only the first 5
}, [transaction]);
```

The spread `[...transaction]` is important. `Array.sort` **mutates in place** — calling it directly on `transaction` would re-order the original state array, breaking every other calculation that depends on it. Spreading creates a shallow copy first, so the sort only affects the local copy.

---

## 8. Transaction.jsx — The Full Ledger

> 📄 `src/components/Transaction.jsx`

### 8.1 The Multi-Filter System

The Transaction page supports three simultaneous independent filters:

```js
const filtered = useMemo(() => {
  return transaction.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || tx.category === category;

    const matchesType =
      typeFilter === "all" || tx.type === typeFilter;

    // ALL three conditions must pass — this is AND logic, not OR
    return matchesSearch && matchesCategory && matchesType;
  });
}, [transaction, search, category, typeFilter]);
```

The `&&` (AND) operator means all three conditions must be true simultaneously. A transaction only appears if it matches the search text AND the selected category AND the selected type. This is intuitive filtering behaviour — each additional filter narrows the results.

Each filter change also resets the page to 1:

```js
const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
const handleCategory = (e) => { setCategory(e.target.value); setPage(1); };
```

Without this reset, changing a filter while on page 3 could leave you on a page that no longer exists (e.g., filtering down to 5 results but remaining on page 3 of what were 30).

---

### 8.2 useMemo — Performance Optimisation

`useMemo` stores the result of an expensive computation and only recalculates when its dependencies change:

```js
const filtered = useMemo(() => expensiveFilterFn(), [dep1, dep2, dep3]);
```

Without `useMemo`, `filtered` would be recalculated on **every single render** — including renders triggered by completely unrelated state changes (like typing a character in an input on a different component). With `useMemo`, if `transaction`, `search`, `category`, and `typeFilter` haven't changed since the last render, React returns the cached result instantly.

For the 21 seed transactions, this is imperceptible. For a user with 1,000 transactions over 3 years, this becomes important.

---

### 8.3 Pagination Logic

```js
const PAGE_SIZE  = 10;
const totalCount = filtered.length;
const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
const startIndex = (page - 1) * PAGE_SIZE;        // 0-based
const endIndex   = Math.min(startIndex + PAGE_SIZE, totalCount); // exclusive
const paginated  = filtered.slice(startIndex, endIndex);
```

Walking through the math for page 2 of 25 results:
- `startIndex = (2-1) * 10 = 10`
- `endIndex = Math.min(10 + 10, 25) = 20`
- `paginated = filtered.slice(10, 20)` → items 11 through 20

For the last page (page 3):
- `startIndex = (3-1) * 10 = 20`
- `endIndex = Math.min(20 + 10, 25) = 25`  ← `Math.min` prevents going past the array end
- `paginated = filtered.slice(20, 25)` → items 21 through 25

`Math.max(1, ...)` ensures `totalPages` is never 0, which would render "Page 1 of 0" when there are no results.

---

## 9. Budgets.jsx — Budget Manager

> 📄 `src/components/Budgets.jsx`

### 9.1 Reading the Budget Data Structure

```js
const monthBudgets = budgets[currentMonthKey] || {};
// e.g. { groceries: 50000, transport: 20000, utilities: 15000 }
```

The `|| {}` fallback is essential. If no budgets have been set for the current month, `budgets[currentMonthKey]` would be `undefined`. Attempting to read `undefined.groceries` would throw a `TypeError` and crash the app. The fallback ensures we always get a safe, empty object.

Summary totals are derived by reducing over the category list:

```js
const totalBudget = Object.values(monthBudgets).reduce((a, b) => a + b, 0);

const totalSpent = EXPENSE_CATEGORIES.reduce(
  (acc, cat) => acc + (spendingByCategory[cat] || 0), 0
);
```

`(spendingByCategory[cat] || 0)` handles categories where nothing has been spent yet — `spendingByCategory[cat]` would be `undefined`, and `undefined || 0` safely returns `0`.

---

### 9.2 Inline Editing Pattern

Each category row has an edit button. Clicking it puts that row into edit mode by setting `editingCategory` to the category's name. Only one row can be in edit mode at a time:

```js
const [editingCategory, setEditingCategory] = useState(null); // null = no row editing
const [editValue, setEditValue]             = useState("");

const startEdit = (cat) => {
  setEditingCategory(cat);
  setEditValue(String(monthBudgets[cat] || "")); // Pre-fill with current value
};
```

In the JSX, each row conditionally renders either an input (if it's the editing row) or the display view:

```jsx
{isEditing ? (
  <>
    <input value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus />
    <button onClick={() => confirmEdit(cat)}>✓</button>
    <button onClick={cancelEdit}>✕</button>
  </>
) : (
  <button onClick={() => startEdit(cat)}>Edit</button>
)}
```

The `autoFocus` attribute on the input places the cursor in the field immediately when edit mode activates — a small UX detail that makes inline editing feel responsive and natural.

---

### 9.3 Progress Bar Colour Logic

Each category's progress bar changes colour based on what percentage of the budget has been spent:

```js
const barColor = (pct) => {
  if (pct >= 100) return "bg-[#C0392B]";  // Red  — over budget
  if (pct >= 75)  return "bg-[#E67E22]";  // Orange — warning zone (75–99%)
  return "bg-[#2A5C45]";                  // Green — healthy (0–74%)
};
```

This three-tier system gives users an at-a-glance health indicator without needing to read numbers. It mirrors traffic lights — green, orange, red. The 75% threshold is a convention in budgeting: "you're getting close, pay attention." The exact colours match the app's overall palette, keeping the design cohesive.

---

## 10. Goals.jsx — Savings Goals

> 📄 `src/components/Goals.jsx`

### 10.1 The Goal Data Model

Each goal object created by `addGoal` in Context has six fields:

```js
{
  id:           Date.now(),       // Unique timestamp-based ID
  name:         "Emergency Fund",
  targetAmount: 500000,           // ₦500,000 — target to reach
  savedAmount:  0,                // Starts at zero, grows with addFundsToGoal
  targetDate:   "2026-12-31",    // ISO date string
  createdAt:    "2026-05-01",    // Date the goal was created
}
```

The progress percentage is always derived, never stored:

```js
const pct = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
```

`Math.min(..., 100)` caps the percentage at 100% so the progress bar never overflows — even if a user somehow saves more than the target amount.

---

### 10.2 Days Left Countdown

```js
const daysLeft = (targetDate) => {
  const diff = new Date(targetDate) - new Date(); // Difference in milliseconds
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // Convert to days
};
```

Subtracting two `Date` objects gives the difference in **milliseconds**. The conversion factor `1000 * 60 * 60 * 24` is:

```
1000 milliseconds = 1 second
× 60 seconds = 1 minute
× 60 minutes = 1 hour
× 24 hours = 1 day
```

`Math.ceil` rounds up so "0.5 days remaining" shows as "1 day left" rather than "0 days left", which would feel alarming and incorrect from the user's perspective.

A **negative result** means the deadline has passed. The UI checks for this:

```jsx
{!done && isExpired && (
  <span className="bg-[#FDECEA] text-[#C0392B]">Overdue</span>
)}
```

---

### 10.3 Balance Validation Before Adding Funds

When a user tries to add funds to a goal, two validations run:

```js
const handleAddFunds = (goalId) => {
  const amount = parseFloat(fundAmount);

  if (!fundAmount || amount <= 0)
    return setFundError("Enter a valid amount.");

  if (amount > totalBalance)
    return setFundError("Insufficient balance.");

  addFundsToGoal(goalId, amount); // Only runs if both checks pass
};
```

The `totalBalance` displayed on the Goals page is the same calculation used everywhere else: all income minus all expenses. Since `addFundsToGoal` records a savings expense transaction, the balance updates immediately after funds are added — the UI stays consistent.

---

### 10.4 One Active Funding Form at a Time

The state variable `fundingGoalId` tracks which goal (if any) currently has its "Add Funds" input open. Because it's a single value (not a Set or array), only one goal can be in funding mode at a time:

```js
const [fundingGoalId, setFundingGoalId] = useState(null);
const [fundAmount, setFundAmount]       = useState("");

// In each goal card:
const isFunding = fundingGoalId === goal.id;

{isFunding ? (
  <div>
    <input type="number" value={fundAmount} ... autoFocus />
    <button onClick={() => handleAddFunds(goal.id)}>Add</button>
    <button onClick={() => setFundingGoalId(null)}>✕</button>
  </div>
) : (
  <button onClick={() => setFundingGoalId(goal.id)}>+ Add Funds</button>
)}
```

Clicking "Add Funds" on a second goal while the first is open automatically closes the first, because `setFundingGoalId(goal.id)` replaces the previous value. This is a clean, implicit UX behaviour with zero extra code.

---

## 11. Architecture Summary

### 11.1 Data Flow Diagram

Here is the complete data flow through the application:

```
USER ACTION              TRIGGERS              UPDATES                RE-RENDERS
─────────────────────────────────────────────────────────────────────────────────
Clicks + button      → handleToggle()      → isOpen: true       → Form appears
Fills form + submit  → handleSubmit()      → transaction[]      → Asset, Transaction
Sets a budget        → setCategoryBudget() → budgets{}          → Asset, Budgets
Removes a budget     → removeCategoryBudget() → budgets{}       → Asset, Budgets
Creates a goal       → addGoal()           → goals[]            → Goals
Adds funds to goal   → addFundsToGoal()    → goals[] + txns[]   → Goals, Asset, Transaction
Deletes a goal       → deleteGoal()        → goals[]            → Goals
```

All state changes flow through Context → localStorage automatically via `useLocalStorage`. The UI re-renders reactively whenever state changes — no manual DOM manipulation needed.

---

### 11.2 Key Design Decisions Explained

**Q: Why is `<Form />` rendered in `App.jsx` above the routes, not inside a specific page?**

The add-transaction form is accessible from any page via the + button in the Header. If it were inside `Asset.jsx`, navigating to Transactions would **unmount** the component and the form would disappear. Placing it in `App.jsx` above the `<Routes>` block keeps it persistent and always available.

---

**Q: Why does `currentMonthKey` come from transaction data instead of the real system clock?**

Using `new Date()` for the current month would mean the April 2026 budget tracker shows data for May 2026 — where there are no seed transactions yet, resulting in an empty, unhelpful dashboard. Using the latest transaction date as "current" ensures the dashboard always shows the richest available data, which is better for demonstration and development.

---

**Q: Why use `Date.now()` as IDs?**

`Date.now()` returns a Unix timestamp in milliseconds — a large integer guaranteed to be unique for any two items added more than 1ms apart (which covers all realistic user interactions). For a client-only app with no server, this is a simple, dependency-free ID strategy. In a production app with a backend, you'd use UUIDs or server-generated IDs.

---

**Q: Why does `addFundsToGoal` write to both `goals` and `transactions`?**

This is the **single source of truth** principle applied carefully. The balance displayed on the Goals page is derived from the same `transaction` array used to calculate the balance on the Home page. If goal contributions weren't recorded as transactions, the balance would be inconsistent between pages — the Home page would still show the old (higher) balance while Goals showed a depleted one.

---

**Q: Why Tailwind with arbitrary values like `bg-[#2A5C45]`?**

Tailwind's predefined colour palette doesn't include SmartSet's specific earthy green brand colour. Arbitrary value syntax (square brackets) allows using any hex colour while still benefiting from Tailwind's utility-class approach, tree-shaking of unused styles, and responsive prefix system (`sm:`, `md:`, etc.).

---

### 11.3 What You Could Build Next

Here are natural feature extensions, ordered from easiest to most complex:

**Easy**
- **Delete transactions** — Add a delete button to each row in `Transaction.jsx`. Call `setTransaction(prev => prev.filter(tx => tx.id !== id))`.
- **Error clearing** — Clear `formInput.message` when the user starts typing after an error, rather than waiting until the next submit attempt.

**Intermediate**
- **Edit transactions** — Populate `formInput` with an existing transaction's values and add an `isEditing` flag to `handleSubmit` that does an array map-replace instead of append.
- **Date range filtering** — Add from/to date pickers to `Transaction.jsx`. Filter by `tx.date >= fromDate && tx.date <= toDate`.
- **Search in Goals** — Add a search bar to `Goals.jsx` to filter goals by name, useful when a user has many goals.

**Advanced**
- **Charts** — Use `recharts` or `chart.js` to plot monthly income vs. expense as a bar chart on the Home page. All the data is already being calculated — you just need to format it for the chart library.
- **Multi-month budget views** — Add a month selector dropdown to `Budgets.jsx`. The data structure already supports it: `budgets[anyMonthKey][category]` works for any month.
- **Export to CSV** — Serialise the `transactions` array to a CSV string and trigger a download via a Blob URL. No library needed.
- **Backend sync** — Replace `useLocalStorage` with API calls to a Node/Express or Supabase backend. The Context functions (`addGoal`, `setCategoryBudget`, etc.) would just need their internals swapped from `setGoals()` to `await fetch(...)`. The component code stays identical.
- **Multiple users / accounts** — Add an authentication layer. Each user gets their own localStorage namespace or backend row.

---

*End of SmartSet Developer Guide*  
*Built with React · Tailwind CSS · React Router · localStorage*