import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<HTMLElement> {
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.basketButton = this.container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;
    this.basketCounter = this.container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;

    this.basketButton.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  setBasketCounter(count: number): void {
    this.basketCounter.textContent = String(count);
  }

  display(): HTMLElement {
    return this.container;
  }
}
