import type { TransactionType } from "../types/transaction";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  id: string;
  onChange: (type: TransactionType) => void;
}

const TransactionTypeSelector = ({ value, id, onChange }: TransactionTypeSelectorProps) => {
  const transactionsTypeButtons = [
    {
      type: "expense" as TransactionType,
      label: "Despesa",
      activeClass: `bg-red-300 border-red-600 text-red-700 font-midium`,
      inativeClass: `bg-transparent border-red-300 text-red-500 hover:bg-red-50`,
    },
    {
      type: "income" as TransactionType,
      label: "Receita",
      activeClass: `bg-green-300 border-green-600 text-green-700 font-midium`,
      inativeClass: `bg-transparent border-green-300 text-green-500 hover:bg-green-50`,
    },
  ];

  return (
    <fieldset id={id} className="grid grid-cols-2 gap-4">
      {transactionsTypeButtons.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 transaction all
            ${value === item.type ? item.activeClass : item.inativeClass}`}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypeSelector;
