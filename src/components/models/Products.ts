import { IProduct } from "../../types";

/**
 * Модель каталога товаров.
 * Управляет списком товаров и выбранным товаром.
 */
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  /**
   * Устанавливает список товаров.
   * @param {IProduct[]} items - Массив товаров.
   */
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  /**
   * Возвращает список товаров.
   * @returns {IProduct[]} Массив товаров.
   */
  getItems():  IProduct[] {
    return this.items;
  }

  /**
   * Находит товар по идентификатору.
   * @param {string} id - Идентификатор товара.
   * @returns {IProduct | null} Найденный товар или null.
   */
  getProductById(id: string): IProduct | null {
    return this.items.find((item) => item.id === id) || null;
  }

  /**
   * Устанавливает выбранный товар.
   * @param {IProduct} item - Товар для выбора.
   */
  setSelectedProduct(item: IProduct): void {
    this.selectedItem = item;
  }

  /**
   * Возвращает выбранный товар.
   * @returns {IProduct | null} Выбранный товар или null.
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedItem;
  }
}