import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Модель корзины.
 * Хранит выбранные товары и умеет считать итоговую сумму.
 * 
 * При любом изменении содержимого эмитит событие `cart:changed`.
 */
export class Cart {
  private items: IProduct[] = [];

  constructor(private events?: IEvents) {}

  /**
   * Возвращает список товаров в корзине.
   * @returns Массив товаров.
   */
  getProducts(): IProduct[] {
    return this.items;
  }

  /**
   * Добавляет товар в корзину.
   * 
   * Игнорирует товары без цены и дубликаты.
   * При успехе эмитит `cart:changed`.
   * @param product Товар.
   */
  addProduct(product: IProduct): void {
    if (product.price === null || this.isProductInCart(product.id)) return;
    this.items.push(product);
    this.events?.emit("cart:changed");
  }

  /**
   * Удаляет товар из корзины по идентификатору.
   * Эмитит `cart:changed`.
   * @param productId Идентификатор товара.
   */
  removeProduct(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.events?.emit("cart:changed");
  }

  /**
   * Очищает корзину.
   * Эмитит `cart:changed`.
   */
  clearCart(): void {
    this.items = [];
    this.events?.emit("cart:changed");
  }

  /**
   * Считает общую стоимость товаров в корзине.
   * @returns Сумма в синапсах.
   */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  /**
   * Возвращает количество товаров в корзине.
   * @returns Количество товаров.
   */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет, находится ли товар в корзине.
   * @param productId Идентификатор товара.
   * @returns true, если товар уже добавлен.
   */
  isProductInCart(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}