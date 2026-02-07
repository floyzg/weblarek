import { Card } from "./Card";
import { IEvents } from "../../base/Events";

/**
 * Карточка товара в каталоге.
 * Отвечает за отображение товара и обработку выбора.
 */
export class CardCatalog extends Card {
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.container.addEventListener("click", () => {
      // Сообщаем презентеру, что пользователь выбрал карточку для предпросмотра
      this.events.emit("card:select", { id: this.container.dataset.id });
    });
  }
}
