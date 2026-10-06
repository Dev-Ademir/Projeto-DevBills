import { AlertCircle, ArrowDown, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import { type ChangeEvent, useCallback, useEffect, useReducer, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import { deleteTransactions, getTransactions } from "../services/transactionService";
import type { Transaction } from "../types/transaction";
import { formatCurrency, formatDate } from "../utils/formatters";

// ─── Tipos do reducer ────────────────────────
type FetchState = {
  loading: boolean;
  error: string;
  transactions: Transaction[];
  filtered: Transaction[];
};

type FetchAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Transaction[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "FILTER"; payload: string }
  | { type: "DELETE"; payload: string };

// ─── Reducer ─────────────────────────────────
function fetchReducer(state: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        transactions: action.payload,
        filtered: action.payload,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "FILTER": {
      const term = action.payload.toLowerCase();
      return {
        ...state,
        filtered: state.transactions.filter((t) => t.description.toLowerCase().includes(term)),
      };
    }
    case "DELETE":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
        filtered: state.filtered.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

// ─── Componente ──────────────────────────────
const Transactions = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [deletingId, setDeletingId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  // ✅ Um reducer no lugar de 4 useState
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: "",
    transactions: [],
    filtered: [],
  });

  // ✅ fetch usando dispatch
  const fetchTransactions = useCallback(async (): Promise<void> => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getTransactions({ month, year });
      dispatch({ type: "FETCH_SUCCESS", payload: data.transactions });
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: "Algo deu errado, não foi possível carregar as transações.",
      });
    }
  }, [month, year]);

  // ✅ delete usando dispatch
  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeletingId(id);
      await deleteTransactions(id);
      toast.success("Transação deletada com sucesso.");
      dispatch({ type: "DELETE", payload: id });
    } catch (error) {
      console.error(error);
      toast.error("Falha ao deletar a transação.");
    } finally {
      setDeletingId("");
    }
  };

  const confirmDelete = (id: string): void => {
    if (window.confirm("Tem certeza que deseja deletar essa transação?")) {
      handleDelete(id);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ✅ busca usando dispatch
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearchText(value);
    dispatch({ type: "FILTER", payload: value });
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
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

      <div className="mb-6">
        <Input
          placeholder="Buscar transações ..."
          icon={<Search size={16} />}
          fullWidth
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>

      <Card className="overflow-hidden">
        {state.loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : state.error ? (
          <div className="pt-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p>{state.error}</p>
            <Button onClick={fetchTransactions} className="mx-auto mt-6">
              Tentar novamente
            </Button>
          </div>
        ) : state.filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma transação encontrada.</p>
            <Link
              to="/transacao/nova"
              className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl inline-flex items-center justify-center hover:bg-primary-600 transition-all glow shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-700 min-h-full w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Descrição
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                  ></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {state.filtered.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800">
                    <td className="px-2 py-1 text-sm text-gray-400 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {transaction.type === "income" ? (
                            <ArrowUp className="w-4 h-4 text-primary-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-primary-500">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="text-primary-700 px-2 py-1 text-sm whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="text-primary-700 px-2 py-1 text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: transaction.category.color }}
                        />
                        <span className="text-sm">{transaction.category.name}</span>
                      </div>
                    </td>
                    <td className="text-primary-700 px-2 py-1 text-sm whitespace-nowrap">
                      <span
                        className={`${transaction.type === "income" ? "text-primary-500" : "text-red-600"}`}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-sm whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => confirmDelete(transaction.id)}
                        className="cursor-pointer text-black hover:text-red-700 transition-all"
                        disabled={deletingId === transaction.id}
                      >
                        {deletingId === transaction.id ? (
                          <span className="inline-block w-2 h-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Trash2 />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
