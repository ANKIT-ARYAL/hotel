"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Ban } from "lucide-react";
import { toast } from "sonner";

interface BookingDatePickerProps {
  label?: string;
  value?: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  onClear?: () => void;
  minDate?: string; // Format: YYYY-MM-DD
  maxDate?: string; // Format: YYYY-MM-DD
  minDateError?: string; // Custom toast error when clicking a date before minDate
  maxDateError?: string; // Custom toast error when clicking a date after maxDate
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  theme?: "light" | "dark";
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingDatePicker({
  label,
  value,
  onChange,
  onClear,
  minDate,
  maxDate,
  minDateError,
  maxDateError,
  placeholder = "MM / DD / YYYY",
  className = "",
  id,
  name,
  required,
  theme = "light",
}: BookingDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // User navigation month (only set when user clicks < or >)
  const [navMonth, setNavMonth] = useState<Date | null>(null);

  // Derive current displayed month directly during render (avoids cascading render warning)
  const currentMonth = (() => {
    if (navMonth) {
      if (minDate) {
        const [minY, minM] = minDate.split("-").map(Number);
        if (minY && minM) {
          const minMonthDate = new Date(minY, minM - 1, 1);
          if (navMonth < minMonthDate) return minMonthDate;
        }
      }
      return navMonth;
    }
    if (value) {
      const [y, m] = value.split("-").map(Number);
      if (y && m) return new Date(y, m - 1, 1);
    }
    if (minDate) {
      const [y, m] = minDate.split("-").map(Number);
      if (y && m) return new Date(y, m - 1, 1);
    }
    return new Date();
  })();

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Format value for display: MM / DD / YYYY
  const displayFormattedDate = () => {
    if (!value) return placeholder;
    const [y, m, d] = value.split("-");
    if (!y || !m || !d) return placeholder;
    return `${m.padStart(2, "0")} / ${d.padStart(2, "0")} / ${y}`;
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Navigation limits
  const isPrevDisabled = (() => {
    if (!minDate) return false;
    const [minY, minM] = minDate.split("-").map(Number);
    if (!minY || !minM) return false;
    const minMonthDate = new Date(minY, minM - 1, 1);
    const prevMonthDate = new Date(year, month - 1, 1);
    return prevMonthDate < minMonthDate;
  })();

  const isNextDisabled = (() => {
    if (!maxDate) return false;
    const [maxY, maxM] = maxDate.split("-").map(Number);
    if (!maxY || !maxM) return false;
    const maxMonthDate = new Date(maxY, maxM - 1, 1);
    const nextMonthDate = new Date(year, month + 1, 1);
    return nextMonthDate > maxMonthDate;
  })();

  const handlePrevMonth = () => {
    if (!isPrevDisabled) {
      setNavMonth(new Date(year, month - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (!isNextDisabled) {
      setNavMonth(new Date(year, month + 1, 1));
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
    setNavMonth(null);
    setIsOpen(false);
  };

  const handleDisabledDayClick = (dateStr: string, isPast: boolean, isAfterMax: boolean) => {
    if (isPast) {
      toast.error(minDateError || "This date is in the past and cannot be selected.");
    } else if (isAfterMax) {
      toast.error(maxDateError || "You cannot select a check-in date that is on or later than the check-out date.");
    }
  };

  const isLight = theme === "light";

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-xs uppercase tracking-widest font-medium mb-2 ${
            isLight ? "text-zinc-500" : "text-white/70"
          }`}
        >
          {label}
        </label>
      )}

      {/* Date Display Button / Input Trigger */}
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 px-4 flex items-center justify-between cursor-pointer transition-colors border select-none ${
          isLight
            ? `bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400 ${isOpen ? "border-zinc-900 ring-1 ring-zinc-900" : ""}`
            : `bg-white/5 text-white border-white/20 hover:border-white/40 ${isOpen ? "border-white/60" : ""}`
        } ${className}`}
      >
        <span
          className={`font-mono tracking-wider text-base ${
            value ? (isLight ? "text-zinc-900 font-semibold" : "text-white font-semibold") : (isLight ? "text-zinc-400" : "text-white/40")
          }`}
        >
          {displayFormattedDate()}
        </span>
        <CalendarIcon className={`w-5 h-5 flex-shrink-0 ${isLight ? "text-zinc-500" : "text-white/60"}`} />
      </div>

      {/* Hidden input for form submission compatibility */}
      {name && <input type="hidden" name={name} value={value || ""} required={required} />}

      {/* Calendar Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 z-50 p-4 rounded-2xl shadow-2xl border transition-all animate-in fade-in zoom-in-95 duration-150 ${
            isLight
              ? "bg-white border-zinc-200 text-zinc-900 shadow-zinc-300/50"
              : "bg-zinc-900 border-zinc-800 text-white shadow-black/80"
          }`}
          style={{ minWidth: "290px", width: "100%", maxWidth: "340px" }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              aria-label="Previous month"
              className={`p-1.5 rounded-full transition-colors ${
                isPrevDisabled
                  ? "opacity-20 cursor-not-allowed"
                  : isLight
                  ? "hover:bg-zinc-100 text-zinc-700"
                  : "hover:bg-zinc-800 text-zinc-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-semibold text-sm tracking-wide">
              {MONTH_NAMES[month]} {year}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={isNextDisabled}
              aria-label="Next month"
              className={`p-1.5 rounded-full transition-colors ${
                isNextDisabled
                  ? "opacity-20 cursor-not-allowed"
                  : isLight
                  ? "hover:bg-zinc-100 text-zinc-700"
                  : "hover:bg-zinc-800 text-zinc-300"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <span
                key={d}
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isLight ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank padding cells before the first day of the month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`pad-${i}`} className="h-9 w-full" />
            ))}

            {/* Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast = minDate ? dateStr < minDate : false;
              const isAfterMax = maxDate ? dateStr > maxDate : false;

              // If this date is unavailable (in the past or after max date limit):
              // Show blurred/dimmed date with interactive 🚫 icon and pop-up error on click
              if (isPast || isAfterMax) {
                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDisabledDayClick(dateStr, isPast, isAfterMax)}
                    title={
                      isAfterMax
                        ? (maxDateError || "Check-in cannot be on or after check-out")
                        : (minDateError || "Date is in the past")
                    }
                    className="relative group h-9 w-full flex items-center justify-center cursor-not-allowed select-none rounded-lg hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <span
                      className={`text-sm select-none transition-opacity duration-150 ${
                        isLight
                          ? "text-zinc-400 opacity-30 blur-[0.6px] group-hover:opacity-10"
                          : "text-zinc-500 opacity-25 blur-[0.6px] group-hover:opacity-10"
                      }`}
                    >
                      {day}
                    </span>
                    <Ban
                      className={`w-4 h-4 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none scale-75 group-hover:scale-100 text-red-500`}
                    />
                  </div>
                );
              }

              const isSelected = value === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-9 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? isLight
                        ? "bg-zinc-900 text-white font-bold shadow-md shadow-zinc-900/20"
                        : "bg-white text-zinc-900 font-bold shadow-md shadow-white/20"
                      : isLight
                      ? "text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95"
                      : "text-zinc-200 hover:bg-zinc-800 hover:text-white active:scale-95"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer with Clear Action */}
          {value && (
            <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
              <span className={isLight ? "text-zinc-400" : "text-zinc-500"}>Selected: {displayFormattedDate()}</span>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  onClear?.();
                  setIsOpen(false);
                }}
                className={`font-medium underline underline-offset-2 transition-colors ${
                  isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-300 hover:text-white"
                }`}
              >
                Clear Date
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
