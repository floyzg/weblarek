import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { Cart } from "../models/Cart";

/**
 * Представление корзины.
 * Отвечает за отображение списка товаров и итоговой суммы.
 */
export class Basket extends Component<HTMLElement> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected total: HTMLElement;
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
    this.total = priceEl as HTMLElement;

    this.button.addEventListener("click", () => {
      events.emit("order:open");
    });
  }

  /**
   * Отображает содержимое корзины.
   * @param {Cart} cart - Модель корзины.
   * @returns {HTMLElement} Элемент корзины.
   */
  display(cart: Cart): HTMLElement {
    this.list.innerHTML = "";
    const items = cart.getProducts();

    items.forEach((product, index) => {
      const item = document.createElement("div");
      item.className = "basket__item";
      item.innerHTML = `
        <span class="basket__item-index">${index + 1}</span>
        <span class="basket__item-title">${product.title}</span>
        <span class="basket__item-price">${product.price} синапсов</span>
        <button class="basket__item-delete" aria-label="Удалить" data-id="${product.id}"></button>
      `;

      item
        .querySelector(".basket__item-delete")
        ?.addEventListener("click", () => {
          this.events.emit("basket:remove", { id: product.id });
        });

      this.list.appendChild(item);
    });

    this.total.textContent = `${cart.getTotalPrice()} синапсов`;
    this.button.disabled = items.length === 0;
    return this.container;
  }
}
