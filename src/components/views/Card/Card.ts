import { Component } from "../../base/Component";
import { CDN_URL, categoryMap } from "../../../utils/constants";

/**
 * Базовый класс карточки товара.
 * Отвечает за отображение информации о товаре.
 */
export class Card extends Component<HTMLElement> {
  protected title: HTMLElement;
  protected image: HTMLImageElement;
  protected price: HTMLElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.title = this.container.querySelector(".card__title") as HTMLElement;
    this.image = this.container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.price = this.container.querySelector(".card__price") as HTMLElement;
    this.category = this.container.querySelector(
      ".card__category",
    ) as HTMLElement;
  }

  /**
   * Устанавливает заголовок карточки.
   * @param {string} title - Название товара.
   */
  setTitle(title: string): void {
    this.title.textContent = title;
  }

  /**
   * Устанавливает изображение товара.
   * @param {string} image - Имя файла изображения.
   * @param {string} alt - Альтернативный текст.
   */
  setImageUrl(image: string, alt: string): void {
    this.image.src = `${CDN_URL}/${image}`;
    this.image.alt = alt;
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
   * Устанавливает категорию товара и соответствующий класс.
   * @param {string} category - Категория.
   */
  setCategory(category: string): void {
    this.category.textContent = category;

    // categoryMap in constants already contains full modifier classes like 'card__category_soft'
    const modifierClass =
      (categoryMap as Record<string, string>)[category] || categoryMap["другое"];

    this.category.className = `card__category ${modifierClass}`;
  }
}
