import { Component } from "../../base/Component";
import type { CardViewData } from "../../../types";

/**
 * Базовый класс карточки товара.
 * Отвечает за отображение информации о товаре.
 */
export class Card extends Component<CardViewData> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected productId: string | null = null;

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

  /**
   * Сохраняет id товара внутри компонента (UI-состояние).
   * Представление не должно брать данные из DOM (dataset).
   */
  setId(id: string): void {
    this.productId = id;
  }

  /**
   * Возвращает сохранённый id товара.
   */
  getId(): string {
    if (!this.productId) {
      throw new Error("Product id is not set in Card");
    }
    return this.productId;
  }
}
