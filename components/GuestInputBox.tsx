"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface GuestInputBoxProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function GuestInputBox({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
  inputClassName = "",
  placeholder = "Select or type guest count..."
}: GuestInputBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const guestOptions = [
    { count: 1, label: "1 Guest (Solo)" },
    { count: 2, label: "2 Guests (Couple)" },
    { count: 3, label: "3 Guests" },
    { count: 4, label: "4 Guests (Family)" },
    { count: 5, label: "5 Guests" },
    { count: 6, label: "6 Guests (1 Full Jeep)" },
  ];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative flex items-center">
        <input
          type="number"
          min={min}
          max={max}
          value={value || ""}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange(isNaN(val) || val < 1 ? 1 : val);
          }}
          placeholder={placeholder}
          className={`w-full pr-10 focus:outline-none transition-colors ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400/80 hover:text-amber-400 p-1 transition-colors"
          tabIndex={-1}
          aria-label="Toggle guest dropdown"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-400" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#09111e] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400/90 uppercase tracking-wider border-b border-slate-800/80 flex items-center justify-between">
            <span>Quick Select (1–6)</span>
            <span className="text-[9px] text-slate-400 font-normal">Or type number</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {guestOptions.map((opt) => (
              <button
                key={opt.count}
                type="button"
                onClick={() => {
                  onChange(opt.count);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                  value === opt.count
                    ? "bg-amber-500/20 text-amber-300 font-bold"
                    : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.count && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
