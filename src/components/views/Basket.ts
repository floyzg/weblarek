import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import type { BasketViewData } from "../../types";

/**
 * Представление корзины.
 * Отвечает за отображение списка товаров и итоговой суммы.
 */
export class Basket extends Component<BasketViewData> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected totalEl: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    // Ищем элементы внутри контейнера
    const listEl = this.container.querySelector(".basket__list");
    const buttonEl = this.container.querySelector(".basket__button");
    const priceEl = this.container.querySelector(".basket__price");

    if (!listEl || !buttonEl || !priceEl) {
      console.error("Basket elements not found. Container:", container);
      throw new Error("Basket template elements not found");
    }

    this.list = listEl as HTMLElement;
    this.button = buttonEl as HTMLButtonElement;
    this.totalEl = priceEl as HTMLElement;

    this.button.addEventListener("click", () => {
      // Сообщаем презентеру, что пользователь начал оформление заказа
      events.emit("order:open");
    });
  }

 /**
 * Устанавливает разметку элементов корзины.
 * Представление не строит разметку само, получает готовые элементы.
 */
set items(items: HTMLElement[]) {
  this.list.replaceChildren(...items);
}

/** Устанавливает итоговую сумму. */
set total(total: number) {
  this.totalEl.textContent = `${total} синапсов`;
}

/** Управляет доступностью кнопки оформления. */
set disabled(disabled: boolean) {
  this.button.disabled = disabled;
}

// Алиасы для обратной совместимости (можно удалить позже)
set totalPrice(total: number) {
  this.total = total;
}

set isCheckoutDisabled(disabled: boolean) {
  this.disabled = disabled;
}
}
