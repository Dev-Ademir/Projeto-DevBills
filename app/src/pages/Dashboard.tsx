import { ArrowUp, Calendar, TrendingUp, Wallet, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactionsMonthly } from "./../services/transactionService";
import { getTransactionsSummary } from "../services/transactionService";
import type { MonthlyItem, TransactionSummary } from "../types/transaction";
import { formatCurrency } from "../utils/formatters";
import { Link } from "react-router";

const initialSummary: TransactionSummary = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  expenseByCategory: [],
};

interface ChartLabelProps {
  name?: string;
  percent?: number;
}

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionsSummary() {
      const response = await getTransactionsSummary({ month, year });
      setSummary(response);
    }
    loadTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionsMonthly() {
      const response = await getTransactionsMonthly(month, year, 12);

      setMonthlyItemsData(response.history);
    }
    loadTransactionsMonthly();
  }, [month, year]);

  const expenseChartData = summary.expenseByCategory.map((entry) => ({
    ...entry,
    fill: entry.categoryColor,
  }));

  const renderPieChartLabel = ({ name, percent }: ChartLabelProps) => {
    return `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`;
  };

  const FormatToolTipValue = (value: ValueType | undefined): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <Link
          to="/transacao/nova"
          className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Link>
      </div>
      <div className="mb-6">
        <MonthYearSelect
          month={month}
          year={year} 
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          gloweffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
          ${summary.balance < 0 ? "text-red-300" : "text-primary-500"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className={"text-2xl font-semibold mt-2 text-primary-500"}>
            {formatCurrency(summary.totalIncome)}
          </p>
        </Card>

        <Card icon={<Wallet size={20} className="text-red-900" />} title="Despesas" hover>
          <p className={"text-2xl font-semibold mt-2 text-red-700"}>
            {formatCurrency(summary.totalExpense)}
          </p>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por categoria"
          className="min-h-80"
        >
          {summary.expenseByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChartLabel}
                  ></Pie>
                  <Tooltip formatter={FormatToolTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-600">
              <p>Sem dados registrados para esse mês.</p>
            </div>
          )}
        </Card>
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico dos ultimos 12 meses."
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyItemsData} margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray={"3 3"} stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3BB"
                    tick={{ style: { fontSize: 7, textTransform: "capitalize" } }}
                    tickMargin={8}
                    interval={0}
                  />
                  <YAxis
                    stroke="#94A3BB"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 10 } }}
                  />
                  <Tooltip
                    formatter={FormatToolTipValue}
                    contentStyle={{
                      backgroundColor: "#1A1A",
                      borderColor: "#2A2A2A",
                    }}
                    labelStyle={{ color: "f8f8f8" }}
                  />
                  <Legend />
                  <Bar dataKey="expenses" name="Despesas" fill="#FF6184" />
                  <Bar dataKey="income" name="Receitas" fill="#37E359" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Sem dados registrados para esse mês.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
