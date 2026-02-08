import { Card } from "./Card";

/**
 * Карточка товара в каталоге.
 * Отвечает за отображение товара и обработку выбора.
 * Не хранит данные товара, сообщает о клике через колбэк.
 */
export class CardCatalog extends Card {
  protected onClick: () => void;
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);
    this.onClick = actions.onClick;

    const imgEl = this.container.querySelector(".card__image");
    if (!imgEl) throw new Error("CardCatalog: .card__image not found");
    this.image = imgEl as HTMLImageElement;

    const categoryEl = this.container.querySelector(".card__category");
    if (!categoryEl) throw new Error("CardCatalog: .card__category not found");
    this.category = categoryEl as HTMLElement;

    this.container.addEventListener("click", () => {
      this.onClick();
    });
  }

  /**
   * Устанавливает картинку карточки.
   * @param url Ссылка на изображение.
   * @param alt Текст для атрибута alt.
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
      "card__category_additional",
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
