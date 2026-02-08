import { Component } from "../../base/Component";
import type { CardViewData } from "../../../types";

/**
 * Базовый класс карточки товара.
 * Отвечает за отображение информации о товаре.
 */
export class Card extends Component<CardViewData> {
  protected title: HTMLElement;
  protected price: HTMLElement;


  constructor(container: HTMLElement) {
    super(container);
    this.title = this.container.querySelector(".card__title") as HTMLElement;
    this.price = this.container.querySelector(".card__price") as HTMLElement;
  }

  /**
   * Устанавливает заголовок карточки.
   * @param {string} title - Название товара.
   */
  setTitle(title: string): void {
    this.title.textContent = title;
  }

  /**
   * Устанавливает цену товара.
   * @param {number | null} price - Цена товара.
   */
  setPrice(price: number | null): void {
    if (price === null) {
      this.price.textContent = "Бесценно";
    } else {
      this.price.textContent = `${price} синапсов`;
    }
  }
}
