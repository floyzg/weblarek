import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Модель каталога товаров.
 * Управляет списком товаров и выбранным товаром.
 * 
 * Эмитит события:
 * - `catalog:changed` — когда загружен/обновлён каталог;
 * - `product:selected` — когда выбран товар для предпросмотра.
 */
export class Products {
  constructor(private events?: IEvents) {}

  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  /**
   * Сохраняет список товаров в модели.
   * Эмитит `catalog:changed`.
   * @param items Массив товаров.
   */
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events?.emit("catalog:changed");
  }

  /**
   * Возвращает список товаров каталога.
   * @returns Массив товаров.
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Ищет товар в каталоге по идентификатору.
   * @param id Идентификатор товара.
   * @returns Товар или null, если не найден.
   */
  getProductById(id: string): IProduct | null {
    return this.items.find((item) => item.id === id) || null;
  }

  /**
   * Устанавливает выбранный товар для предпросмотра.
   * Эмитит `product:selected` без payload (презентер берёт данные из модели).
   * @param item Выбранный товар.
   * @returns void
   */
  setSelectedProduct(item: IProduct): void {
    this.selectedItem = item;
    this.events?.emit("product:selected");
  }

  /**
   * Возвращает текущий выбранный товар.
   * @returns Выбранный товар или null.
   */
  getSelectedProduct(): IProduct | null {
    return this.selectedItem;
  }
}