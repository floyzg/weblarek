import { Component } from "../../base/Component";
import { CDN_URL } from "../../../utils/constants";

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

  setTitle(title: string): void {
    this.title.textContent = title;
  }

  setImageUrl(image: string, alt: string): void {
    this.image.src = `${CDN_URL}/${image}`;
    this.image.alt = alt;
  }

  setPrice(price: number | null): void {
    if (price === null) {
      this.price.textContent = "Бесценно";
    } else {
      this.price.textContent = `${price} синапсов`;
    }
  }

  setCategory(category: string): void {
    const categoryMap: Record<string, string> = {
      "софт-скил": "soft",
      "хард-скил": "hard",
      другое: "other",
      дополнительное: "additional",
      кнопка: "button",
    };
    this.category.textContent = category;
    this.category.className = `card__category card__category_${categoryMap[category] || "other"}`;
  }
}
