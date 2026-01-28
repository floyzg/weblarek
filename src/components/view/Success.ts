import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Success extends Component<HTMLElement> {
  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.description = this.container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this.closeButton = this.container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    this.closeButton.addEventListener("click", () => {
      events.emit("success:close");
    });
  }

  setTotal(total: number): void {
    this.description.textContent = `Списано ${total} синапсов`;
  }

  display(): HTMLElement {
    return this.container;
  }
}
