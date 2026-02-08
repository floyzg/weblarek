import { IProduct } from "../../../types";
import { Card } from "./Card";

/**
 * Карточка товара в корзине.
 * Отвечает за отображение товара в списке корзины и удаление.
 */
export class CardBasket extends Card {
  protected index: HTMLElement;
  protected button: HTMLButtonElement;
  protected onRemove: () => void;

  constructor(container: HTMLElement, actions: { onRemove: () => void }) {
    super(container);
    this.onRemove = actions.onRemove;

    this.index = this.container.querySelector(
      ".basket__item-index",
    ) as HTMLElement;
    this.button = this.container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.onRemove();
    });
  }

  /**
   * Устанавливает порядковый номер товара в корзине.
   * @param {number} index - Индекс в списке.
   */
  setIndex(index: number): void {
    this.index.textContent = String(index);
  }

  /**
   * Отображает карточку товара в корзине.
   * @param product Данные товара.
   * @param index Порядковый номер в корзине (начиная с 1).
   * @returns Элемент карточки.
   */
  display(product: IProduct, index: number): HTMLElement {
    this.setTitle(product.title);
    this.setPrice(product.price);
    this.setIndex(index);
    return this.container;
  }
}
