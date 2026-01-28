import { Card } from "./Card";
import { IEvents } from "../../base/Events";

export class CardCatalog extends Card {
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.container.dataset.id });
    });
  }
}
