import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useContext } from "react";
import { myContext } from "../Context";

const Form = () => {
  const {
    formInput,
    handleToggle,
    isOpen,
    finType,
    handleInput,
    handleSubmit,
  } = useContext(myContext);

  return (
    <>
      {isOpen && (
       
        <div
          className="fixed inset-0 z-50 overflow-y-auto pb-8"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleToggle();
          }}
        >
        
          <div className="flex flex-col justify-end min-h-full sm:justify-center sm:p-6">
            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              
              className="w-full sm:max-w-md sm:mx-auto bg-[#FFFFFF] rounded-t-3xl sm:rounded-2xl shadow-2xl"
            >
              {/* Drag handle — visible on mobile only */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1.5 bg-[#D5D0CA] rounded-full" />
              </div>

              <div className="px-5 pb-5 pt-2">
                {/* ── Header ── */}
                <div className="flex justify-between items-center py-4 border-b-2 border-[#E2DDD5]">
                  <h3 className="font-semibold text-[#2A5C45] text-lg">
                    Add Transaction
                  </h3>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-[#2A5C45] rounded-full p-1.5 bg-[#E2DDD5] hover:scale-105 transition-transform"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                </div>

                {/* ── Income / Expense toggle ── */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => finType("expense")}
                    className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background:
                        formInput.type === "expense" ? "#FDECEA" : "#F0EDE7",
                      border:
                        formInput.type === "expense"
                          ? "2px solid #C0392B"
                          : "2px solid #E2DDD5",
                      color:
                        formInput.type === "expense" ? "#C0392B" : "#7A756C",
                    }}
                  >
                    − Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => finType("income")}
                    className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background:
                        formInput.type === "income" ? "#EAF2EC" : "#F0EDE7",
                      border:
                        formInput.type === "income"
                          ? "2px solid #1E7A56"
                          : "2px solid #E2DDD5",
                      color:
                        formInput.type === "income" ? "#1E7A56" : "#7A756C",
                    }}
                  >
                    + Income
                  </button>
                </div>

                {/* ── Form fields ── */}
                <div className="flex flex-col gap-4 mt-5">
                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formInput.description}
                      onChange={handleInput}
                      placeholder="e.g. Groceries at ShopRite"
                      className="border-2 border-[#E2DDD5] bg-[#F0EDE7] w-full px-3 py-2.5 rounded-xl text-sm text-[#3A3530] outline-none focus:border-[#4A9268] focus:ring-2 focus:ring-[#4A9268]/20 transition-all duration-200 placeholder:text-[#B0A99F]"
                    />
                  </div>

                  {/* Amount + Date on the same row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
                        Amount (₦)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formInput.amount}
                        onChange={handleInput}
                        placeholder="0"
                        className="border-2 border-[#E2DDD5] bg-[#F0EDE7] w-full px-3 py-2.5 rounded-xl text-sm text-[#3A3530] outline-none focus:border-[#4A9268] focus:ring-2 focus:ring-[#4A9268]/20 transition-all duration-200 placeholder:text-[#B0A99F]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formInput.date}
                        onChange={handleInput}
                        className="border-2 border-[#E2DDD5] bg-[#F0EDE7] w-full px-3 py-2.5 rounded-xl text-sm text-[#3A3530] outline-none focus:border-[#4A9268] focus:ring-2 focus:ring-[#4A9268]/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formInput.category}
                      onChange={handleInput}
                      className="border-2 border-[#E2DDD5] bg-[#F0EDE7] w-full px-3 py-2.5 rounded-xl text-sm text-[#3A3530] outline-none focus:border-[#4A9268] focus:ring-2 focus:ring-[#4A9268]/20 transition-all duration-200"
                    >
                      <option value="">Select a category…</option>
                      <option value="groceries">Groceries</option>
                      <option value="transport">Transport</option>
                      <option value="housing">Housing</option>
                      <option value="dining out">Dining Out</option>
                      <option value="utilities">Utilities</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="health">Health</option>
                      <option value="education">Education</option>
                      <option value="savings">Savings</option>
                      <option value="income">Income</option>
                      <option value="investment">Investment</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  {/* Account */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
                      Account
                    </label>
                    <select
                      name="account"
                      value={formInput.account}
                      onChange={handleInput}
                      className="border-2 border-[#E2DDD5] bg-[#F0EDE7] w-full px-3 py-2.5 rounded-xl text-sm text-[#3A3530] outline-none focus:border-[#4A9268] focus:ring-2 focus:ring-[#4A9268]/20 transition-all duration-200"
                    >
                      <option value="">Select an account…</option>
                      <option value="GTBank Current - *4821">
                        GTBank Current — *4821
                      </option>
                      <option value="Access Bank Savings - *9034">
                        Access Bank Savings — *9034
                      </option>
                      <option value="Cowrywise Portfolio">
                        Cowrywise Portfolio
                      </option>
                      <option value="Binance Wallet">Binance Wallet</option>
                    </select>
                  </div>
                </div>

                {/* ── Validation error ── */}
                {formInput.message && (
                  <p className="mt-3 text-xs font-medium text-[#C0392B] text-right">
                    {formInput.message}
                  </p>
                )}

                {/* ── Action buttons ── */}
                {/*
                 * pb-8 gives clearance above the iPhone home indicator on mobile.
                 * sm:pb-0 removes that extra space on larger screens.
                 */}
                <div className="flex gap-3 mt-5 pb-8 sm:pb-0">
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="flex-1 py-3 text-sm font-semibold text-[#7A756C] border-2 border-[#E2DDD5] rounded-xl hover:bg-[#F0EDE7] active:scale-95 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-sm font-semibold text-white bg-[#2A5C45] rounded-xl hover:bg-[#1E7A56] active:scale-95 transition-all duration-200"
                  >
                    Add Transaction
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
