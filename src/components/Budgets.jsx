import React, { useState, useMemo } from "react";
import { useContext } from "react";
import { myContext } from "../Context";
import { EXPENSE_CATEGORIES } from "../Context";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";

const Budgets = () => {
  const { transaction, budgets, setCategoryBudget, removeCategoryBudget } =
    useContext(myContext);

  const currentMonthKey = useMemo(() => {
    const keys = [
      ...new Set(
        transaction.map((tx) => {
          const d = new Date(tx.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        }),
      ),
    ].sort();
    return keys[keys.length - 1];
  }, [transaction]);

  const currentMonthLabel = useMemo(() => {
    if (!currentMonthKey) return "";
    const [year, month] = currentMonthKey.split("-");
    return new Date(year, parseInt(month) - 1).toLocaleString("en-NG", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonthKey]);

  const spendingByCategory = useMemo(() => {
    return transaction
      .filter((tx) => {
        const d = new Date(tx.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === currentMonthKey && tx.type === "expense";
      })
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});
  }, [transaction, currentMonthKey]);

  const monthBudgets = budgets[currentMonthKey] || {};

  const totalBudget = Object.values(monthBudgets).reduce((a, b) => a + b, 0);
  const totalSpent = EXPENSE_CATEGORIES.reduce(
    (acc, cat) => acc + (spendingByCategory[cat] || 0),
    0,
  );
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCategories = EXPENSE_CATEGORIES.filter(
    (cat) =>
      monthBudgets[cat] && (spendingByCategory[cat] || 0) > monthBudgets[cat],
  );

  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setEditValue(String(monthBudgets[cat] || ""));
  };

  const confirmEdit = (cat) => {
    if (editValue && parseFloat(editValue) > 0) {
      setCategoryBudget(currentMonthKey, cat, editValue);
    }
    setEditingCategory(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleAdd = () => {
    if (!newCategory || !newAmount || parseFloat(newAmount) <= 0) return;
    setCategoryBudget(currentMonthKey, newCategory, newAmount);
    setNewCategory("");
    setNewAmount("");
    setAddOpen(false);
  };

  const unbudgetedCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !monthBudgets[cat],
  );

  const fmt = (n) =>
    `₦${Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const barColor = (pct) => {
    if (pct >= 100) return "bg-[#C0392B]";
    if (pct >= 75) return "bg-[#E67E22]";
    return "bg-[#2A5C45]";
  };

  return (
    <div className="p-4 pt-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2A5C45]">Budgets</h2>
          <p className="text-xs text-[#7A756C] mt-0.5">{currentMonthLabel}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#2A5C45] text-white rounded-xl hover:bg-[#1E7A56] transition-colors duration-200"
        >
          <FiPlus size={14} /> Set Budget
        </button>
      </div>

      {addOpen && (
        <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-[#2A5C45]">
              Add Category Budget
            </h3>
            <button
              onClick={() => setAddOpen(false)}
              className="text-[#B0A99F] hover:text-[#3A3530]"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#7A756C]">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border-2 border-[#E2DDD5] bg-[#F0EDE7] p-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#4A9268]"
              >
                <option value="">Select…</option>
                {unbudgetedCategories.map((c) => (
                  <option key={c} value={c}>
                    {capitalize(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#7A756C]">Amount (₦)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="border-2 border-[#E2DDD5] bg-[#F0EDE7] p-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#4A9268]"
              />
            </div>
          </div>

          {unbudgetedCategories.length === 0 && (
            <p className="text-xs text-[#7A756C]">
              All categories already have a budget set this month.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setAddOpen(false)}
              className="px-3 py-1.5 text-xs border-2 border-[#E2DDD5] text-[#7A756C] rounded-lg hover:opacity-80"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newCategory || !newAmount}
              className="px-3 py-1.5 text-xs bg-[#2A5C45] text-white rounded-lg hover:bg-[#1E7A56] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add Budget
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#2A5C45] text-[#F5F3EE] p-4 rounded-2xl flex flex-col gap-1">
          <p className="text-xs opacity-70">Total Budget</p>
          <p className="text-lg font-bold">{fmt(totalBudget)}</p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-1">
          <p className="text-xs text-[#7A756C]">Amount Spent</p>
          <p className="text-lg font-semibold text-[#C0392B]">
            {fmt(totalSpent)}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-1">
          <p className="text-xs text-[#7A756C]">Amount Remaining</p>
          <p
            className={`text-lg font-semibold ${totalRemaining >= 0 ? "text-[#1E7A56]" : "text-[#C0392B]"}`}
          >
            {fmt(totalRemaining)}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-1">
          <p className="text-xs text-[#7A756C]">Over Budget</p>
          <p className="text-lg font-semibold text-[#C0392B]">
            {overBudgetCategories.length}{" "}
            <span className="text-sm font-normal text-[#7A756C]">
              {overBudgetCategories.length === 1 ? "category" : "categories"}
            </span>
          </p>
          {overBudgetCategories.length > 0 && (
            <p className="text-[10px] text-[#C0392B] leading-tight">
              {overBudgetCategories.map(capitalize).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#3A3530]">
          Category Breakdown
        </h3>

        {EXPENSE_CATEGORIES.map((cat) => {
          const budget = monthBudgets[cat] || 0;
          const spent = spendingByCategory[cat] || 0;
          const remaining = budget - spent;
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          const isOver = budget > 0 && spent > budget;
          const isEditing = editingCategory === cat;

          return (
            <div
              key={cat}
              className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#3A3530] capitalize">
                    {cat}
                  </span>
                  {isOver && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#FDECEA] text-[#C0392B] rounded-full">
                      Over budget
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 text-xs border-2 border-[#4A9268] bg-[#F0EDE7] px-2 py-1 rounded-lg outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => confirmEdit(cat)}
                        className="p-1.5 text-[#1E7A56] hover:bg-[#EAF2EC] rounded-lg"
                      >
                        <FiCheck size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-[#B0A99F] hover:bg-[#F0EDE7] rounded-lg"
                      >
                        <FiX size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-[#7A756C] hover:text-[#2A5C45] hover:bg-[#EAF2EC] rounded-lg transition-colors"
                        title={budget > 0 ? "Edit budget" : "Set budget"}
                      >
                        <FiEdit2 size={13} />
                      </button>
                      {budget > 0 && (
                        <button
                          onClick={() =>
                            removeCategoryBudget(currentMonthKey, cat)
                          }
                          className="p-1.5 text-[#7A756C] hover:text-[#C0392B] hover:bg-[#FDECEA] rounded-lg transition-colors"
                          title="Remove budget"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-xs text-[#7A756C]">
                <span>
                  Spent:{" "}
                  <span
                    className={`font-medium ${isOver ? "text-[#C0392B]" : "text-[#3A3530]"}`}
                  >
                    {fmt(spent)}
                  </span>
                </span>
                {budget > 0 ? (
                  <span>
                    {remaining >= 0 ? "Remaining: " : "Over by: "}
                    <span
                      className={`font-medium ${remaining >= 0 ? "text-[#1E7A56]" : "text-[#C0392B]"}`}
                    >
                      {fmt(Math.abs(remaining))}
                    </span>
                    {" / "}
                    <span className="text-[#3A3530] font-medium">
                      {fmt(budget)}
                    </span>
                  </span>
                ) : (
                  <span className="italic text-[#B0A99F]">No budget set</span>
                )}
              </div>

              <div className="w-full bg-[#F0EDE7] rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    budget > 0 ? barColor(pct) : "bg-[#E2DDD5]"
                  }`}
                  style={{ width: budget > 0 ? `${pct}%` : "0%" }}
                />
              </div>

              {budget > 0 && (
                <p className="text-[10px] text-[#7A756C] text-right">
                  {Math.round((spent / budget) * 100)}% used
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
