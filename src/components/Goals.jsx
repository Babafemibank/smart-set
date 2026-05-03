import React, { useState, useMemo } from "react";
import { useContext } from "react";
import { myContext } from "../Context";
import {
  FiPlus, FiX, FiTrash2, FiTarget, FiCalendar, FiDollarSign, FiCheckCircle,
} from "react-icons/fi";

const Goals = () => {
  const { transaction, goals, addGoal, addFundsToGoal, deleteGoal } =
    useContext(myContext);

  // ── Total all-time balance ────────────────────────────────────────────────
  const totalBalance = useMemo(
    () =>
      transaction.reduce(
        (acc, tx) =>
          tx.type === "income" ? acc + tx.amount : acc - tx.amount,
        0
      ),
    [transaction]
  );

  // ── "Add Goal" form state ─────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: "", targetAmount: "", targetDate: "" });
  const [goalError, setGoalError] = useState("");

  const handleGoalInput = (e) => {
    const { name, value } = e.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
    setGoalError("");
  };

  const handleAddGoal = () => {
    if (!goalForm.name.trim()) return setGoalError("Please enter a goal name.");
    if (!goalForm.targetAmount || parseFloat(goalForm.targetAmount) <= 0)
      return setGoalError("Please enter a valid target amount.");
    if (!goalForm.targetDate) return setGoalError("Please pick a target date.");

    addGoal(goalForm);
    setGoalForm({ name: "", targetAmount: "", targetDate: "" });
    setFormOpen(false);
    setGoalError("");
  };

  // ── "Add Funds" state — one active goal at a time ─────────────────────────
  const [fundingGoalId, setFundingGoalId] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundError, setFundError] = useState("");

  const handleAddFunds = (goalId) => {
    const amount = parseFloat(fundAmount);
    if (!fundAmount || amount <= 0) return setFundError("Enter a valid amount.");
    if (amount > totalBalance) return setFundError("Insufficient balance.");

    addFundsToGoal(goalId, amount);
    setFundingGoalId(null);
    setFundAmount("");
    setFundError("");
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmt = (n) =>
    `₦${Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  const daysLeft = (targetDate) => {
    const diff = new Date(targetDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric", month: "short", year: "numeric",
    });

  const barColor = (pct) => {
    if (pct >= 100) return "bg-[#1E7A56]";
    if (pct >= 60)  return "bg-[#2A5C45]";
    if (pct >= 30)  return "bg-[#4A9268]";
    return "bg-[#B0CFC0]";
  };

  // ── Summary stats ─────────────────────────────────────────────────────────
  const totalGoals      = goals.length;
  const totalTargeted   = goals.reduce((a, g) => a + g.targetAmount, 0);
  const totalSaved      = goals.reduce((a, g) => a + g.savedAmount, 0);
  const completedGoals  = goals.filter((g) => g.savedAmount >= g.targetAmount).length;

  return (
    <div className="p-4 pt-6 flex flex-col gap-5">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2A5C45]">Goals</h2>
          <p className="text-xs text-[#7A756C] mt-0.5">
            Available balance: <span className="font-semibold text-[#2A5C45]">{fmt(totalBalance)}</span>
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#2A5C45] text-white rounded-xl hover:bg-[#1E7A56] transition-colors duration-200"
        >
          <FiPlus size={14} /> Add Goal
        </button>
      </div>

      {/* ── Add Goal Form ───────────────────────────────────────────────────── */}
      {formOpen && (
        <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-[#2A5C45]">New Saving Goal</h3>
            <button onClick={() => { setFormOpen(false); setGoalError(""); }}
              className="text-[#B0A99F] hover:text-[#3A3530]">
              <FiX size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#7A756C]">Goal Name</label>
            <input
              type="text"
              name="name"
              value={goalForm.name}
              onChange={handleGoalInput}
              placeholder="e.g. Emergency Fund, New Laptop"
              className="border-2 border-[#E2DDD5] bg-[#F0EDE7] p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#4A9268]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#7A756C]">Target Amount (₦)</label>
              <input
                type="number"
                name="targetAmount"
                value={goalForm.targetAmount}
                onChange={handleGoalInput}
                placeholder="e.g. 500000"
                className="border-2 border-[#E2DDD5] bg-[#F0EDE7] p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#4A9268]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#7A756C]">Target Date</label>
              <input
                type="date"
                name="targetDate"
                value={goalForm.targetDate}
                onChange={handleGoalInput}
                className="border-2 border-[#E2DDD5] bg-[#F0EDE7] p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#4A9268]"
              />
            </div>
          </div>

          {goalError && (
            <p className="text-xs text-[#C0392B]">{goalError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setFormOpen(false); setGoalError(""); }}
              className="px-3 py-1.5 text-xs border-2 border-[#E2DDD5] text-[#7A756C] rounded-lg hover:opacity-80"
            >
              Cancel
            </button>
            <button
              onClick={handleAddGoal}
              className="px-3 py-1.5 text-xs bg-[#2A5C45] text-white rounded-lg hover:bg-[#1E7A56] transition-colors"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#2A5C45] text-[#F5F3EE] p-4 rounded-2xl flex flex-col gap-1">
            <p className="text-xs opacity-70">Total Targeted</p>
            <p className="text-lg font-bold">{fmt(totalTargeted)}</p>
            <p className="text-[10px] opacity-60">{totalGoals} goal{totalGoals !== 1 ? "s" : ""}</p>
          </div>

          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-1">
            <p className="text-xs text-[#7A756C]">Total Saved</p>
            <p className="text-lg font-semibold text-[#1E7A56]">{fmt(totalSaved)}</p>
            <p className="text-[10px] text-[#7A756C]">
              {totalTargeted > 0
                ? `${Math.round((totalSaved / totalTargeted) * 100)}% of all goals`
                : "—"}
            </p>
          </div>

          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-1">
            <p className="text-xs text-[#7A756C]">Still Needed</p>
            <p className="text-lg font-semibold text-[#C0392B]">
              {fmt(Math.max(totalTargeted - totalSaved, 0))}
            </p>
          </div>

          <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] p-4 rounded-2xl flex flex-col gap-1">
            <p className="text-xs text-[#7A756C]">Completed</p>
            <p className="text-lg font-semibold text-[#2A5C45]">
              {completedGoals}{" "}
              <span className="text-sm font-normal text-[#7A756C]">
                / {totalGoals}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── Goal Cards ─────────────────────────────────────────────────────── */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <FiTarget size={40} className="text-[#E2DDD5]" />
          <p className="text-sm font-medium text-[#7A756C]">No goals yet</p>
          <p className="text-xs text-[#B0A99F]">
            Tap "Add Goal" to start saving toward something meaningful.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {goals.map((goal) => {
            const pct       = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
            const remaining = goal.targetAmount - goal.savedAmount;
            const done      = goal.savedAmount >= goal.targetAmount;
            const days      = daysLeft(goal.targetDate);
            const isExpired = days < 0;
            const isFunding = fundingGoalId === goal.id;

            return (
              <div
                key={goal.id}
                className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl p-4 flex flex-col gap-3"
              >
                {/* Row 1: Title + badges + delete */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#3A3530]">
                        {goal.name}
                      </span>
                      {done && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 bg-[#EAF2EC] text-[#1E7A56] rounded-full">
                          <FiCheckCircle size={10} /> Completed
                        </span>
                      )}
                      {!done && isExpired && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#FDECEA] text-[#C0392B] rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>

                    {/* Target date */}
                    <div className="flex items-center gap-1 text-[10px] text-[#7A756C]">
                      <FiCalendar size={10} />
                      <span>
                        {formatDate(goal.targetDate)}
                        {!done && !isExpired && (
                          <span className="ml-1 text-[#4A9268]">
                            ({days} day{days !== 1 ? "s" : ""} left)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-[#B0A99F] hover:text-[#C0392B] hover:bg-[#FDECEA] rounded-lg transition-colors flex-shrink-0"
                    title="Delete goal"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>

                {/* Row 2: Amounts */}
                <div className="flex justify-between text-xs text-[#7A756C]">
                  <span>
                    Saved:{" "}
                    <span className="font-semibold text-[#1E7A56]">{fmt(goal.savedAmount)}</span>
                  </span>
                  <span>
                    Target:{" "}
                    <span className="font-semibold text-[#3A3530]">{fmt(goal.targetAmount)}</span>
                  </span>
                </div>

                {/* Row 3: Progress bar */}
                <div className="w-full bg-[#F0EDE7] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${barColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Row 4: % label */}
                <div className="flex justify-between text-[10px] text-[#7A756C]">
                  <span>{Math.round(pct)}% achieved</span>
                  {!done && (
                    <span>
                      {fmt(remaining)} remaining
                    </span>
                  )}
                </div>

                {/* Row 5: Add Funds */}
                {!done && (
                  isFunding ? (
                    <div className="flex flex-col gap-2 pt-1 border-t border-[#F0EDE7]">
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <FiDollarSign
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#B0A99F]"
                          />
                          <input
                            type="number"
                            value={fundAmount}
                            onChange={(e) => { setFundAmount(e.target.value); setFundError(""); }}
                            placeholder="Amount to add"
                            className="w-full pl-7 pr-3 py-2 text-xs border-2 border-[#E2DDD5] bg-[#F0EDE7] rounded-xl outline-none focus:ring-1 focus:ring-[#4A9268]"
                            autoFocus
                          />
                        </div>
                        <button
                          onClick={() => handleAddFunds(goal.id)}
                          className="px-3 py-2 text-xs bg-[#2A5C45] text-white rounded-xl hover:bg-[#1E7A56] transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => { setFundingGoalId(null); setFundAmount(""); setFundError(""); }}
                          className="p-2 text-[#B0A99F] hover:text-[#3A3530] rounded-xl hover:bg-[#F0EDE7]"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                      {fundError && (
                        <p className="text-[10px] text-[#C0392B]">{fundError}</p>
                      )}
                      <p className="text-[10px] text-[#7A756C]">
                        Available: <span className="font-medium text-[#2A5C45]">{fmt(totalBalance)}</span>
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setFundingGoalId(goal.id);
                        setFundAmount("");
                        setFundError("");
                      }}
                      className="w-full py-2 text-xs font-medium border-2 border-[#2A5C45] text-[#2A5C45] rounded-xl hover:bg-[#EAF2EC] transition-colors duration-200"
                    >
                      + Add Funds
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;