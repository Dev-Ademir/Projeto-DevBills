import type { Category } from "../types/category";
import { api } from "./api";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("categories");
    return response.data;
  } catch (erro) {
    console.error(erro);
    throw new Error("Falha ao acessar as categorias", { cause: erro });
  }
};
