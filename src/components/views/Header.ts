import type { HeaderViewData } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Представление шапки приложения.
 * Отвечает за отображение кнопки корзины и счетчика.
 */
export class Header extends Component<HeaderViewData> {
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
      // Сообщаем презентеру, что пользователь открыл корзину
      events.emit("basket:open");
    });
  }

  /**
   * Устанавливает значение счётчика корзины.
   * @param count Количество товаров.
   */
  set counter(count: number) {
    this.basketCounter.textContent = String(count);
  }
}
