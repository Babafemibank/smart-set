import { useState, useEffect, createContext } from "react";

export const myContext = createContext();

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

const SEED_TRANSACTIONS = [
  {
    id: "TXN-2023-01-001",
    type: "income",
    description: "Salary January",
    amount: 250000,
    date: "2023-01-31",
    category: "income",
    account: "GTBank Current",
    message: "Monthly salary",
  },
  {
    id: "TXN-2023-01-002",
    type: "expense",
    description: "Supermarket shopping",
    amount: 15000,
    date: "2023-01-10",
    category: "groceries",
    account: "Access Bank Savings",
    message: "Weekly groceries",
  },
  {
    id: "TXN-2023-02-001",
    type: "income",
    description: "Freelance payment",
    amount: 80000,
    date: "2023-02-15",
    category: "income",
    account: "GTBank Current",
    message: "Side project",
  },
  {
    id: "TXN-2023-02-002",
    type: "expense",
    description: "Electricity bill",
    amount: 12000,
    date: "2023-02-20",
    category: "utilities",
    account: "Access Bank Savings",
    message: "Monthly bill",
  },
  {
    id: "TXN-2023-03-001",
    type: "expense",
    description: "Uber rides",
    amount: 9000,
    date: "2023-03-05",
    category: "transport",
    account: "GTBank Current",
    message: "Transport cost",
  },
  {
    id: "TXN-2023-03-002",
    type: "income",
    description: "Salary March",
    amount: 250000,
    date: "2023-03-31",
    category: "income",
    account: "GTBank Current",
    message: "Monthly salary",
  },
  {
    id: "TXN-2023-06-001",
    type: "expense",
    description: "Dinner with friends",
    amount: 20000,
    date: "2023-06-18",
    category: "dining out",
    account: "Access Bank Savings",
    message: "Weekend outing",
  },
  {
    id: "TXN-2023-09-001",
    type: "expense",
    description: "Hospital visit",
    amount: 30000,
    date: "2023-09-12",
    category: "health",
    account: "GTBank Current",
    message: "Medical checkup",
  },
  {
    id: "TXN-2023-12-001",
    type: "income",
    description: "Year bonus",
    amount: 150000,
    date: "2023-12-20",
    category: "income",
    account: "GTBank Current",
    message: "End of year bonus",
  },
  {
    id: "TXN-2024-01-001",
    type: "expense",
    description: "Rent payment",
    amount: 500000,
    date: "2024-01-05",
    category: "housing",
    account: "Access Bank Savings",
    message: "Annual rent",
  },
  {
    id: "TXN-2024-02-001",
    type: "income",
    description: "Crypto profit",
    amount: 120000,
    date: "2024-02-14",
    category: "investment",
    account: "Binance Wallet",
    message: "BTC trade",
  },
  {
    id: "TXN-2024-04-001",
    type: "expense",
    description: "Netflix & Spotify",
    amount: 8000,
    date: "2024-04-02",
    category: "entertainment",
    account: "GTBank Current",
    message: "Subscriptions",
  },
  {
    id: "TXN-2024-07-001",
    type: "expense",
    description: "Online course",
    amount: 45000,
    date: "2024-07-10",
    category: "education",
    account: "Cowrywise Portfolio",
    message: "Skill upgrade",
  },
  {
    id: "TXN-2024-10-001",
    type: "income",
    description: "Investment returns",
    amount: 70000,
    date: "2024-10-25",
    category: "investment",
    account: "Cowrywise Portfolio",
    message: "Quarterly returns",
  },
  {
    id: "TXN-2025-01-001",
    type: "income",
    description: "Salary January",
    amount: 300000,
    date: "2025-01-31",
    category: "income",
    account: "GTBank Current",
    message: "Monthly salary",
  },
  {
    id: "TXN-2025-03-001",
    type: "expense",
    description: "Groceries bulk buy",
    amount: 40000,
    date: "2025-03-11",
    category: "groceries",
    account: "Access Bank Savings",
    message: "Monthly groceries",
  },
  {
    id: "TXN-2025-06-001",
    type: "expense",
    description: "Flight ticket",
    amount: 150000,
    date: "2025-06-15",
    category: "transport",
    account: "GTBank Current",
    message: "Travel",
  },
  {
    id: "TXN-2025-09-001",
    type: "income",
    description: "Side hustle",
    amount: 95000,
    date: "2025-09-08",
    category: "income",
    account: "Access Bank Savings",
    message: "Extra income",
  },
  {
    id: "TXN-2026-01-001",
    type: "expense",
    description: "Gym membership",
    amount: 25000,
    date: "2026-01-03",
    category: "health",
    account: "GTBank Current",
    message: "Fitness",
  },
  {
    id: "TXN-2026-03-001",
    type: "income",
    description: "Stock dividends",
    amount: 60000,
    date: "2026-03-20",
    category: "investment",
    account: "Cowrywise Portfolio",
    message: "Dividend payout",
  },
  {
    id: "TXN-2026-04-001",
    type: "expense",
    description: "Utility bills",
    amount: 18000,
    date: "2026-04-10",
    category: "utilities",
    account: "Access Bank Savings",
    message: "Monthly bills",
  },
];

function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // localStorage quota exceeded or unavailable — fail silently
    }
  }, [key, state]);

  return [state, setState];
}

export const MyContextProvider = ({ children }) => {
  const [transaction, setTransaction] = useLocalStorage(
    "smartset_transactions",
    SEED_TRANSACTIONS,
  );

  const [budgets, setBudgets] = useLocalStorage("smartset_budgets", {});
  const [goals, setGoals] = useLocalStorage("smartset_goals", []);

  const [formInput, setFormInput] = useState({
    id: "",
    type: "",
    description: "",
    amount: "",
    date: "",
    category: "",
    account: "",
    message: "",
  });

  const setCategoryBudget = (monthKey, category, amount) => {
    setBudgets((prev) => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [category]: parseFloat(amount) || 0,
      },
    }));
  };

  const removeCategoryBudget = (monthKey, category) => {
    setBudgets((prev) => {
      const updated = { ...(prev[monthKey] || {}) };
      delete updated[category];
      return { ...prev, [monthKey]: updated };
    });
  };

  const finType = (value) => setFormInput((prev) => ({ ...prev, type: value }));

  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleInput = (e) => {
    const { name, value } = e.target;
    const parsed = name === "amount" ? parseFloat(value) || "" : value;
    setFormInput({ ...formInput, [name]: parsed });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formInput.description.trim() ||
      !formInput.amount ||
      !formInput.date ||
      !formInput.category ||
      !formInput.account ||
      !formInput.type
    ) {
      setFormInput((prev) => ({ ...prev, message: "Please fill all inputs" }));
      return;
    }

    const newTask = {
      ...formInput,
      id: Date.now(),
      amount: parseFloat(formInput.amount),
    };

    setTransaction((prev) => [...prev, newTask]);
    setFormInput({
      id: "",
      type: "",
      description: "",
      amount: "",
      date: "",
      category: "",
      account: "",
      message: "",
    });
    setIsOpen(false);
  };

  const addGoal = ({ name, targetAmount, targetDate }) => {
    const newGoal = {
      id: Date.now(),
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0,
      targetDate,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const addFundsToGoal = (goalId, amount) => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, savedAmount: g.savedAmount + parsed } : g,
      ),
    );

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

  const deleteGoal = (goalId) =>
    setGoals((prev) => prev.filter((g) => g.id !== goalId));

  return (
    <myContext.Provider
      value={{
        formInput,
        setFormInput,
        isOpen,
        setIsOpen,
        handleToggle,
        finType,
        handleInput,
        handleSubmit,
        transaction,
        budgets,
        setCategoryBudget,
        removeCategoryBudget,
        goals,
        addGoal,
        addFundsToGoal,
        deleteGoal,
      }}
    >
      {children}
    </myContext.Provider>
  );
};
