import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

/**
 * Карточка товара для предпросмотра.
 * Отвечает за отображение подробной информации о товаре и кнопку действия.
 * 
 * Важно: компонент не решает, добавлять товар или удалять — он только эмитит событие,
 * а решение принимает Презентер.
 */
export class CardPreview extends Card {
  protected description: HTMLElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.description = this.container.querySelector(
      ".card__text",
    ) as HTMLElement;
    const buttonEl = this.container.querySelector(".card__button");
    if (!buttonEl) {
      throw new Error("Кнопка действия не найдена в шаблоне CardPreview");
    }
    this.button = buttonEl as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.events.emit("basket:add", { id: this.container.dataset.id });
    });
  }

  /**
   * Устанавливает описание товара.
   * @param {string} description - Описание.
   */
  setDescription(description: string): void {
    this.description.textContent = description;
  }

  /**
   * Устанавливает текст кнопки действия.
   * @param {string} text - Текст кнопки.
   */
  setButtonText(text: string): void {
    this.button.textContent = text;
  }

  /**
   * Устанавливает состояние кнопки (активна/неактивна).
   * @param {boolean} disabled - true, если кнопка неактивна.
   */
  setButtonState(disabled: boolean): void {
    this.button.disabled = disabled;
  }

  /**
   * Отображает карточку предпросмотра товара.
   * @param {IProduct} product - Данные товара.
   * @returns {HTMLElement} Элемент карточки.
   */
  display(product: IProduct): HTMLElement {
    this.setTitle(product.title);
    this.setImageUrl(product.image, product.title);
    this.setPrice(product.price);
    this.setCategory(product.category);
    this.setDescription(product.description);
    this.container.dataset.id = product.id;
    return this.container;
  }
}
