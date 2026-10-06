import { AlertCircle, Calendar1, DollarSign, Save, Tag } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "./../components/Input";
import Select from "../components/Select";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { getCategories } from "../services/categoryServices";
import { createTransaction } from "../services/transactionService";
import type { Category } from "../types/category";
import type { CreateTransactionDTO, TransactionType } from "../types/transaction";

interface FormData {
  description: string;
  amount: string;
  date: string;
  categoryId: string;
  type: TransactionType;
}

const initialFormData = {
  description: "",
  amount: "",
  date: "",
  categoryId: "",
  type: "income" as TransactionType,
};

const TransactionsForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const formId = useId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const response = await getCategories();
      setCategories(response);
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => category.type === formData.type);

  const validateForm = (): boolean => {
    if (!formData.description || !formData.amount || !formData.date || !formData.categoryId) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    if (Number(formData.amount) <= 0) {
      setError("O valor da transação deve ser maior que zero.");
      return false;
    }
    return true;
  };

  const handleTransactionType = (itemType: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type: itemType }));
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const { name, value } = event.target;

    if (name === "amount") {
      // aceita só dígitos, vírgula e ponto
      let onlyNumbers = value.replace(/[^0-9.,]/g, "");
      // normaliza vírgula → ponto
      onlyNumbers = onlyNumbers.replace(",", ".");
      // garante só UM separador
      const separators = onlyNumbers.match(/[.,]/g);
      if (separators && separators.length > 1) {
        const firstSeparatorIndex = onlyNumbers.search(/[.,]/);
        onlyNumbers =
          onlyNumbers.slice(0, firstSeparatorIndex + 1) +
          onlyNumbers.slice(firstSeparatorIndex + 1).replace(/[.,]/g, "");
      }
      // limita a 2 casas decimais
      const parts = onlyNumbers.split(/[.,]/);
      if (parts.length === 2 && parts[1].length > 2) {
        const separator = onlyNumbers.includes(",") ? "," : ".";
        onlyNumbers = `${parts[0]}${separator}${parts[1].slice(0, 2)}`;
      }

      setFormData((prev) => ({ ...prev, amount: onlyNumbers }));
      setError(null);
      return;
    }

    // outros campos (description, date, categoryId)
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validateForm()) {
        return;
      }

      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: Number(formData.amount),
        type: formData.type,
        categoryId: formData.categoryId,
        date: `${formData.date}T00:12:00.000Z`, // Adiciona a hora para evitar problemas de fuso horário
      };
      await createTransaction(transactionData);
      toast.success("Transação criada com sucesso!");
      navigate("/transacoes");
    } catch (error) {
      toast.error("Erro ao criar transação.");
      console.error("Tente novamente:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate("/transacoes");
  };

  return (
    <div className="container-app py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
        <Card>
          {error && (
            <div className="flex items-center bg-red-300 border border-red-700 rounded-xl p-3 mb-6 gap-2">
              <AlertCircle className="w-6 h-6 text-red-700" />
              <p className="text-red-700 text-base">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4 flex gap-2 flex-col">
              <label htmlFor={formId}>Tipos de Despesa</label>
              <TransactionTypeSelector
                id={formId}
                value={formData.type}
                onChange={handleTransactionType}
              />
            </div>
            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex.: Supermercado, salário, ..."
            />
            <Input
              label="Valor"
              name="amount"
              type="text"
              inputMode="decimal"
              value={formData.amount}
              onChange={handleChange}
              placeholder="R$ 0,00"
              icon={<DollarSign className="w-4 h-4" />}
              required
            />
            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar1 className="w-4 h-4" />}
            />
            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              icon={<Tag className="w-4 h-4" />}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />
            <div className="flex justify-end space-x-3 mt-2">
              <Button variant="outline" onClick={handleCancel} type="button" disabled={loading}>
                Cancelar
              </Button>
              <Button disabled={loading} type="submit" variant={formData.type === "expense" ? "danger" : "success"}>
                {loading ? (<div className="flex items-center justify-center py-16">
            <div className="w-4 h-4 border-4 border-primary-700 border-t-transparent rounded-full animate-spin"></div>
          </div>): <Save className="w-4 h-4 mr-2" />}
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;
