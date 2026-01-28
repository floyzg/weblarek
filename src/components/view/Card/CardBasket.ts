import { Card } from "./Card";
import { IEvents } from "../../base/Events";

export class CardBasket extends Card {
  protected index: HTMLElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.index = this.container.querySelector(
      ".basket__item-index",
    ) as HTMLElement;
    this.button = this.container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.events.emit("basket:remove", { id: this.container.dataset.id });
    });
  }

  setIndex(index: number): void {
    this.index.textContent = String(index);
  }

  display(product: any, index: number): HTMLElement {
    this.setTitle(product.title);
    this.setPrice(product.price);
    this.setIndex(index);
    this.container.dataset.id = product.id;
    return this.container;
  }
}
