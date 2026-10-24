import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../hooks";
import { HiChevronDown } from "react-icons/hi2";

const ShopFilterAndSort = ({
  sortCriteria,
  setSortCriteria,
}: {
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
}) => {
  const { showingProducts, totalProducts } = useAppSelector((state) => state.shop);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Default", value: "default" },
    { label: "Popularity", value: "popularity" },
    { label: "Price: low to high", value: "price-asc" },
    { label: "Price: high to low", value: "price-desc" },
  ];

  const currentLabel = options.find((opt) => opt.value === sortCriteria)?.label || "Default";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 max-sm:flex-col max-sm:items-start max-sm:gap-3 border-b border-white/10 mb-8 max-w-screen-2xl mx-auto w-full">
      <p className="text-neutral-400 text-sm tracking-widest uppercase">
        Showing <span className="text-white font-semibold">1–{showingProducts}</span> of <span className="text-white font-semibold">{totalProducts}</span> results
      </p>
      
      <div className="flex gap-3 items-center max-sm:w-full max-sm:justify-between">
        <span className="text-neutral-400 text-xs tracking-widest uppercase">Sort by:</span>
        <div className="relative" ref={dropdownRef}>
          {/* Custom Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#141414] text-white border border-white/10 px-4 py-2 rounded-xl text-xs tracking-wider uppercase focus:outline-none focus:border-amber-500 transition-colors cursor-pointer flex items-center justify-between gap-4 w-44"
          >
            <span>{currentLabel}</span>
            <HiChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Custom Dropdown Menu List (Aligned right so it never overflows) */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortCriteria(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                    sortCriteria === opt.value
                      ? "bg-amber-500/10 text-amber-400 font-semibold"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopFilterAndSort;