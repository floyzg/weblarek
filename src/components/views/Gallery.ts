import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import type { GalleryViewData } from "../../types";

/**
 * Представление галереи товаров.
 * Отвечает только за отображение разметки каталога.
 */
export class Gallery extends Component<GalleryViewData> {
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  /**
   * Устанавливает разметку карточек каталога.
   * Представление не строит разметку само — получает готовые элементы.
   */
  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
