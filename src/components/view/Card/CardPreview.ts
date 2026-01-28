import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

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
      throw new Error("Card button not found in CardPreview template");
    }
    this.button = buttonEl as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.events.emit("basket:add", { id: this.container.dataset.id });
    });
  }

  setDescription(description: string): void {
    this.description.textContent = description;
  }

  setButtonText(text: string): void {
    this.button.textContent = text;
  }

  setButtonState(disabled: boolean): void {
    this.button.disabled = disabled;
  }

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
