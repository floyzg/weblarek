import { Card } from "./Card";
import { IEvents } from "../../base/Events";

/**
 * Карточка товара в каталоге.
 * Отвечает за отображение товара и обработку выбора.
 */
export class CardCatalog extends Card {
  protected events: IEvents;
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    const imgEl = this.container.querySelector(".card__image");
    if (!imgEl) throw new Error("CardCatalog: .card__image not found");
    this.image = imgEl as HTMLImageElement;

    const categoryEl = this.container.querySelector(".card__category");
    if (!categoryEl) throw new Error("CardCatalog: .card__category not found");
    this.category = categoryEl as HTMLElement;

    this.container.addEventListener("click", () => {
      // Сообщаем презентеру, что пользователь выбрал карточку для предпросмотра
      this.events.emit("card:select", { id: this.getId() });
    });
  }

  setImageUrl(url: string, alt: string = ""): void {
    this.image.src = url;
    this.image.alt = alt;
  }

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
}
