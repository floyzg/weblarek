import { IProduct } from "../../types";

/**
 * Модель корзины.
 * Отвечает за хранение выбранных товаров и расчёт итоговой стоимости.
 */
export class Cart {
  private items: IProduct[] = [];

  /**
   * Возвращает список товаров в корзине.
   * @returns {IProduct[]} Массив товаров в корзине.
   */
  getProducts(): IProduct[] {
    return this.items;
  }

  /**
   * Добавляет товар в корзину, если его ещё нет.
   * @param {IProduct} product - Товар для добавления.
   */
  addProduct(product: IProduct): void {
    if (product.price === null || this.isProductInCart(product.id)) {
      return;
    }

    this.items.push(product);
  }

  /**
   * Удаляет товар из корзины по id.
   * @param {string} productId - Идентификатор товара.
   */
  removeProduct(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  /**
   * Очищает корзину.
   */
  clearCart(): void {
    this.items = [];
  }

  /**
   * Возвращает итоговую стоимость товаров в корзине.
   * @returns {number} Сумма цен всех товаров.
   */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  /**
   * Возвращает количество товаров в корзине.
   * @returns {number} Количество товаров.
   */
  getItemCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет, находится ли товар в корзине.
   * @param {string} productId - Идентификатор товара.
   * @returns {boolean} true, если товар в корзине.
   */
  isProductInCart(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}