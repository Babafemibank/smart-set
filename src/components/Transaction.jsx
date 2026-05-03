import React, { useState, useMemo } from "react";
import { useContext } from "react";
import { myContext } from "../Context";
import { FiSearch, FiChevronLeft, FiChevronRight, FiX, FiPlus } from "react-icons/fi";

const CATEGORIES = [
  "all",
  "income",
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

const TYPE_FILTERS = ["all", "income", "expense"];

const PAGE_SIZE = 10;

const Transaction = () => {
  const { transaction, handleToggle } = useContext(myContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return transaction
      .filter((tx) => {
        const matchesSearch =
          tx.description.toLowerCase().includes(search.toLowerCase()) ||
          tx.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = category === "all" || tx.category === category;

        const matchesType = typeFilter === "all" || tx.type === typeFilter;

        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
  }, [transaction, search, category, typeFilter]);

  // Reset to page 1 whenever filters change
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };
  const handleType = (val) => {
    setTypeFilter(val);
    setPage(1);
  };
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE; // 0-based
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalCount); // exclusive
  const paginated = filtered.slice(startIndex, endIndex);

  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const goPrev = () => setPage((p) => Math.max(p - 1, 1));

  const fmt = (amount) =>
    `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="p-4 pt-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-[#2A5C45]">Transactions</h2>

      <div className="relative">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A99F]"
          size={16}
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by description or category…"
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-xl outline-none focus:ring-1 focus:ring-[#4A9268] transition-all duration-200 text-[#3A3530] placeholder:text-[#B0A99F]"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0A99F] hover:text-[#3A3530]"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Type toggle pills */}
        <div className="flex gap-2">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => handleType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all duration-200 ${
                typeFilter === t
                  ? t === "expense"
                    ? "bg-[#FDECEA] border-[#C0392B] text-[#C0392B]"
                    : t === "income"
                      ? "bg-[#EAF2EC] border-[#1E7A56] text-[#1E7A56]"
                      : "bg-[#2A5C45] border-[#2A5C45] text-white"
                  : "bg-[#FFFFFF] border-[#E2DDD5] text-[#7A756C] hover:border-[#2A5C45]"
              }`}
            >
              {capitalize(t)}
            </button>
          ))}
        </div>

        <select
          value={category}
          onChange={handleCategory}
          className="flex-1 px-3 py-1.5 text-xs bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-xl outline-none focus:ring-1 focus:ring-[#4A9268] text-[#3A3530] transition-all duration-200"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : capitalize(c)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#FFFFFF] border-2 border-[#E2DDD5] rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-2.5 bg-[#F0EDE7] border-b border-[#E2DDD5]">
          <span className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
            Description
          </span>
          <span className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
            Category
          </span>
          <span className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide">
            Date
          </span>
          <span className="text-xs font-semibold text-[#7A756C] uppercase tracking-wide text-right">
            Amount
          </span>
        </div>

        {paginated.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-[#B0A99F]">
            No transactions match your filters.
          </div>
        ) : (
          paginated.map((tx, i) => (
            <div
              key={tx.id}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3 items-center border-b border-[#F0EDE7] last:border-none ${
                i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#FAFAF8]"
              }`}
            >
              <p className="text-sm text-[#3A3530] font-medium truncate pr-2">
                {tx.description}
              </p>
              <p className="text-xs text-[#7A756C] capitalize">{tx.category}</p>
              <p className="text-xs text-[#7A756C]">{tx.date}</p>
              <p
                className={`text-sm font-semibold text-right ${
                  tx.type === "income" ? "text-[#1E7A56]" : "text-[#C0392B]"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {fmt(tx.amount)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-[#7A756C]">
          {totalCount === 0
            ? "0 transactions"
            : `${startIndex + 1}–${endIndex} of ${totalCount} transaction${totalCount !== 1 ? "s" : ""}`}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="p-1.5 rounded-lg border-2 border-[#E2DDD5] text-[#7A756C] hover:border-[#2A5C45] hover:text-[#2A5C45] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronLeft size={16} />
          </button>

          <span className="text-xs text-[#3A3530] font-medium min-w-[60px] text-center">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border-2 border-[#E2DDD5] text-[#7A756C] hover:border-[#2A5C45] hover:text-[#2A5C45] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
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

export default Transaction;
