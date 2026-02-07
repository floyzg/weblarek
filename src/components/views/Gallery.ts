import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardCatalog } from "./Card/CardCatalog";
import { cloneTemplate } from "../../utils/utils";

/**
 * Представление галереи товаров.
 * Отвечает за отображение каталога товаров.
 */
export class Gallery extends Component<HTMLElement> {
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  /**
   * Отображает список товаров в галерее.
   * @param {IProduct[]} products - Массив товаров.
   * @returns {HTMLElement} Элемент галереи.
   */
  display(products: IProduct[]): HTMLElement {
    this.container.innerHTML = "";

    products.forEach((product) => {
      // Клонируем шаблон карточки каталога (рендерим через template, а не через innerHTML)
      const root = cloneTemplate<HTMLElement>("#card-catalog");

      // В зависимости от шаблона корнем может быть `.card` или обёртка, внутри которой есть `.card`
      const cardEl = root.classList.contains("card")
        ? root
        : (root.querySelector(".card") as HTMLElement | null);

      if (!cardEl) {
        throw new Error(".card not found in #card-catalog template");
      }

      const card = new CardCatalog(cardEl, this.events);

      card.setTitle(product.title);
      card.setImageUrl(product.image, product.title);
      card.setPrice(product.price);
      card.setCategory(product.category);

      // Сохраняем id товара в dataset — обработчик клика в CardCatalog возьмёт его оттуда
      cardEl.dataset.id = product.id;

      // Добавляем карточку в галерею
      this.container.appendChild(root);
    });

    return this.container;
  }

}
