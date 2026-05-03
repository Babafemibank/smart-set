import React, { useMemo } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { myContext } from "../Context";
import { EXPENSE_CATEGORIES } from "../Context";
import { FiArrowRight, FiPlus } from "react-icons/fi";

const Asset = () => {
  const { transaction, budgets, handleToggle } = useContext(myContext);
  const navigate = useNavigate();

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getMonthKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const monthlyIncome = (monthKey) =>
    transaction
      .filter((tx) => getMonthKey(tx.date) === monthKey && tx.type === "income")
      .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlyExpense = (monthKey) =>
    transaction
      .filter(
        (tx) => getMonthKey(tx.date) === monthKey && tx.type === "expense",
      )
      .reduce((acc, tx) => acc + tx.amount, 0);

  const pctChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const totalAsset = transaction.reduce(
    (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
    0,
  );

  const allMonthKeys = [
    ...new Set(transaction.map((tx) => getMonthKey(tx.date))),
  ].sort();

  const currentMonthKey = allMonthKeys[allMonthKeys.length - 1];
  const prevMonthKey = allMonthKeys[allMonthKeys.length - 2];

  const currentIncome = monthlyIncome(currentMonthKey);
  const prevIncome = monthlyIncome(prevMonthKey);
  const incomePctChange = pctChange(currentIncome, prevIncome);

  const currentExpense = monthlyExpense(currentMonthKey);
  const prevExpense = monthlyExpense(prevMonthKey);
  const expensePctChange = pctChange(currentExpense, prevExpense);

  const currentSavings = currentIncome - currentExpense;
  const currentSavingsRate =
    currentIncome === 0 ? 0 : (currentSavings / currentIncome) * 100;
  const prevSavings = prevIncome - prevExpense;
  const prevSavingsRate =
    prevIncome === 0 ? 0 : (prevSavings / prevIncome) * 100;
  const savingsRatePctChange = pctChange(currentSavingsRate, prevSavingsRate);

  const balanceUpToPrev = transaction
    .filter((tx) => getMonthKey(tx.date) <= prevMonthKey)
    .reduce(
      (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
      0,
    );
  const totalAssetPctChange = pctChange(totalAsset, balanceUpToPrev);

  // ── Budget tracker for current month ─────────────────────────────────────
  const monthBudgets = budgets[currentMonthKey] || {};

  const spendingByCategory = useMemo(() => {
    return transaction
      .filter(
        (tx) =>
          getMonthKey(tx.date) === currentMonthKey && tx.type === "expense",
      )
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});
  }, [transaction, currentMonthKey]);

  // Only show categories that have a budget set
  const budgetedCategories = EXPENSE_CATEGORIES.filter(
    (cat) => monthBudgets[cat],
  );

  // ── Recent 5 transactions (sorted newest first) ───────────────────────────
  const recentTransactions = useMemo(() => {
    return [...transaction]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transaction]);

  // ── Formatters ────────────────────────────────────────────────────────────
  const fmt = (amount) =>
    `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  const fmtPct = (value) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

  const barColor = (pct) => {
    if (pct >= 100) return "bg-[#C0392B]";
    if (pct >= 75) return "bg-[#E67E22]";
    return "bg-[#2A5C45]";
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ── Sub-components ────────────────────────────────────────────────────────
  const Badge = ({ value, inverse = false }) => {
    const isGood = inverse ? value <= 0 : value >= 0;
    return (
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
          isGood ? "bg-[#EAF2EC] text-[#1E7A56]" : "bg-[#FDECEA] text-[#C0392B]"
        }`}
      >
        {fmtPct(value)} vs last month
      </span>
    );
  };

  const Card = ({ label, value, pct, inverse = false }) => (
    <div className="w-full bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-2">
      <p className="text-xs text-[#7A756C]">{label}</p>
      <p className="text-lg font-semibold text-[#3A3530]">{value}</p>
      <Badge value={pct} inverse={inverse} />
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-5 w-full pt-6">
      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Balance */}
        <div className="col-span-2 bg-[#2A5C45] text-[#F5F3EE] p-4 rounded-2xl flex flex-col gap-2">
          <p className="text-xs opacity-70">Total Balance (All Time)</p>
          <p className="text-2xl font-bold">{fmt(totalAsset)}</p>
          <Badge value={totalAssetPctChange} />
        </div>

        {/* Monthly Income */}
        <Card
          label={`Income · ${currentMonthKey}`}
          value={fmt(currentIncome)}
          pct={incomePctChange}
        />

        {/* Monthly Expense */}
        <Card
          label={`Expenses · ${currentMonthKey}`}
          value={fmt(currentExpense)}
          pct={expensePctChange}
          inverse={true}
        />

        {/* Savings Rate */}
        <div className="col-span-2 bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-2">
          <p className="text-xs text-[#7A756C]">
            Savings Rate · {currentMonthKey}
          </p>
          <p className="text-lg font-semibold text-[#3A3530]">
            {currentSavingsRate.toFixed(1)}%{" "}
            <span className="text-sm font-normal text-[#7A756C]">
              ({fmt(currentSavings)} saved)
            </span>
          </p>
          <Badge value={savingsRatePctChange} />
        </div>
      </div>

      {/* ── Budget Tracker ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#3A3530]">
            Budget Tracker · {currentMonthKey}
          </h3>
          <button
            onClick={() => navigate("/budgets")}
            className="flex items-center gap-1 text-xs text-[#2A5C45] font-medium hover:underline"
          >
            Manage <FiArrowRight size={12} />
          </button>
        </div>

        {budgetedCategories.length === 0 ? (
          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl p-5 text-center">
            <p className="text-sm text-[#7A756C]">No budgets set yet.</p>
            <button
              onClick={() => navigate("/budgets")}
              className="mt-2 text-xs text-[#2A5C45] font-medium hover:underline"
            >
              Set a budget →
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl overflow-hidden divide-y divide-[#F0EDE7]">
            {budgetedCategories.map((cat) => {
              const budget = monthBudgets[cat];
              const spent = spendingByCategory[cat] || 0;
              const pct = Math.min((spent / budget) * 100, 100);
              const isOver = spent > budget;
              const remaining = budget - spent;

              return (
                <div key={cat} className="px-4 py-3 flex flex-col gap-1.5">
                  {/* Category name + amounts */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#3A3530] capitalize">
                        {cat}
                      </span>
                      {isOver && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#FDECEA] text-[#C0392B] rounded-full">
                          Over
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#7A756C]">
                      <span
                        className={`font-medium ${isOver ? "text-[#C0392B]" : "text-[#3A3530]"}`}
                      >
                        {fmt(spent)}
                      </span>
                      {" / "}
                      {fmt(budget)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#F0EDE7] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${barColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Remaining label */}
                  <p
                    className={`text-[10px] text-right ${isOver ? "text-[#C0392B]" : "text-[#7A756C]"}`}
                  >
                    {isOver
                      ? `Over by ${fmt(Math.abs(remaining))}`
                      : `${fmt(remaining)} left`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Recent Transactions ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#3A3530]">
            Recent Transactions
          </h3>
          <button
            onClick={() => navigate("/transactions")}
            className="flex items-center gap-1 text-xs text-[#2A5C45] font-medium hover:underline"
          >
            See all <FiArrowRight size={12} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl p-5 text-center">
            <p className="text-sm text-[#7A756C]">No transactions yet.</p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl overflow-hidden divide-y divide-[#F0EDE7]">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-4 py-3 gap-3"
              >
                {/* Left: description + meta */}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3A3530] truncate">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-[#B0A99F] capitalize">
                    {tx.category} · {tx.date}
                  </p>
                </div>

                {/* Right: amount */}
                <p
                  className={`text-sm font-semibold flex-shrink-0 ${
                    tx.type === "income" ? "text-[#1E7A56]" : "text-[#C0392B]"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {fmt(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleToggle}
          className="flex justify-center text-white rounded-full bg-[#2A5C45] p-2 border-solid border-[#EAF2EC] border-2 text-base cursor-pointer w-12 h-12 hover:scale-105 "
        >
          <FiPlus size={30} />
        </button>
      </div>
    </div>
  );
};

export default Asset;
