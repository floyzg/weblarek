import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

/**
 * Карточка товара для предпросмотра.
 * Отвечает за отображение подробной информации о товаре и кнопку действия.
 * Компонент не решает бизнес-логику — он только сообщает о нажатии кнопки.
 */
export class CardPreview extends Card {
  protected image: HTMLImageElement;
  protected category: HTMLElement;
  protected description: HTMLElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    const imgEl = this.container.querySelector(".card__image");
    if (!imgEl) throw new Error("CardPreview: .card__image not found");
    this.image = imgEl as HTMLImageElement;

    const categoryEl = this.container.querySelector(".card__category");
    if (!categoryEl) throw new Error("CardPreview: .card__category not found");
    this.category = categoryEl as HTMLElement;

    this.description = this.container.querySelector(
      ".card__text",
    ) as HTMLElement;
    const buttonEl = this.container.querySelector(".card__button");
    if (!buttonEl) {
      throw new Error("Кнопка действия не найдена в шаблоне CardPreview");
    }
    this.button = buttonEl as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.events.emit("basket:toggle");
    });
  }

  /**
   * Устанавливает картинку товара.
   * @param url Ссылка на изображение.
   * @param alt Текст для alt.
   * @returns void
   */
  setImageUrl(url: string, alt: string = ""): void {
    this.image.src = url;
    this.image.alt = alt;
  }

  /**
   * Устанавливает категорию товара и CSS-модификатор.
   * @param category Название категории.
   * @returns void
   */
  setCategory(category: string): void {
    this.category.textContent = category;

    this.category.classList.remove(
      "card__category_soft",
      "card__category_hard",
      "card__category_other",
      "card__category_additional"
    );

    const c = category.toLowerCase();
    if (c.includes("софт")) {
      this.category.classList.add("card__category_soft");
    } else if (c.includes("хард")) {
      this.category.classList.add("card__category_hard");
    } else if (c.includes("другое")) {
      this.category.classList.add("card__category_other");
    } else {
      this.category.classList.add("card__category_additional");
    }
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
   * Управляет доступностью кнопки.
   * @param disabled true — кнопка неактивна.
   */
  set disabled(disabled: boolean) {
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
    return this.container;
  }
}
