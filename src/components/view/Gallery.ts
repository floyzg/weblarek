import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardCatalog } from "./Card/CardCatalog";
import { CDN_URL } from "../../utils/constants";

export class Gallery extends Component<HTMLElement> {
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  display(products: IProduct[]): HTMLElement {
    this.container.innerHTML = "";

    products.forEach((product) => {
      const cardElement = document.createElement("div");
      cardElement.className = "gallery__item";

      const categoryClass = this.getCategoryClass(product.category);
      const imageUrl = `${CDN_URL}/${product.image}`;
      cardElement.innerHTML = `
        <div class="card">
          <span class="card__category card__category_${categoryClass}">${product.category}</span>
          <h2 class="card__title">${product.title}</h2>
          <img src="${imageUrl}" alt="${product.title}" class="card__image">
          <p class="card__price">${product.price === null ? "Бесценно" : product.price + " синапсов"}</p>
        </div>
      `;

      const card = new CardCatalog(
        cardElement.querySelector(".card") as HTMLElement,
        this.events,
      );
      (card as any).container.dataset.id = product.id;

      this.container.appendChild(cardElement);
    });

    return this.container;
  }

  private getCategoryClass(category: string): string {
    const map: Record<string, string> = {
      "софт-скил": "soft",
      "хард-скил": "hard",
      другое: "other",
      дополнительное: "additional",
      кнопка: "button",
    };
    return map[category] || "other";
  }
}
