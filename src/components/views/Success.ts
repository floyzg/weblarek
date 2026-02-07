import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import type { SuccessViewData } from "../../types";

/**
 * Представление успешного оформления заказа.
 * Показывает итоговую сумму и кнопку закрытия.
 */
export class Success extends Component<SuccessViewData> {
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
      // Сообщаем презентеру, что пользователь закрыл экран успеха
      events.emit("success:close");
    });
  }

  /**
   * Устанавливает итоговую сумму заказа.
   * @param {number} total - Сумма заказа.
   */
  setTotal(total: number): void {
    this.description.textContent = `Списано ${total} синапсов`;
  }
}
