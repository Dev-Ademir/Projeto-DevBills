import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MonthNames: readonly string[] = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const MonthYearSelect = ({ month, year, onMonthChange, onYearChange }: MonthYearSelectProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleNextMonth = (): void => {
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };
  const handlePreviousMonth = (): void => {
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };
  return (
    <div className="flex items-center justify-between w-full gap-2 bg-gray-900 rounded-lg p-3 border border-gray-700">
      <button
        type="button"
        className=" p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer shrink-0"
        aria-label="Mês anterior"
        onClick={handlePreviousMonth}
      >
        <ChevronLeft />
      </button>
      <div className="flex gap-2">
        <label htmlFor="month-select" className="sr-only">
          Selecionar o mês
        </label>
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          id="month-select"
          className="bg-gray-800 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focos:ring-
           focus:ring-primary-500 cursor-pointer w-25"
        >
          {MonthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <label htmlFor="year-select" className="sr-only">
          Selecionar o ano
        </label>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          id="year-select"
          className="bg-gray-800 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focos:ring-2
           focus:ring-primary-500 cursor-pointer w-25"
        >
          {years.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className=" p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer shrink-0"
        aria-label="Mês seguinte"
        onClick={handleNextMonth}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthYearSelect;
