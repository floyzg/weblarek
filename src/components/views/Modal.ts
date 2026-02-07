import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

/**
 * Модальное окно.
 * Управляет отображением и содержимым модального окна.
 */
export class Modal extends Component<HTMLElement> {
  protected closeButton: HTMLButtonElement;
  protected content: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.closeButton = this.container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;
    this.content = this.container.querySelector(
      ".modal__content",
    ) as HTMLElement;

    this.closeButton.addEventListener("click", () => {
      this.close();
      events.emit("modal:close");
    });

    this.container.addEventListener("click", (e: MouseEvent) => {
      // Закрываем модалку по клику на подложку (вне контента)
      if (e.target === this.container) {
        this.close();
        events.emit("modal:close");
      }
    });
  }

  /**
   * Открывает модальное окно.
   */
  open(): void {
    this.container.classList.add("modal_active");
  }

  /**
   * Закрывает модальное окно.
   */
  close(): void {
    this.container.classList.remove("modal_active");
  }

  /**
   * Устанавливает содержимое модального окна.
   * Полностью заменяет предыдущий контент.
   * @param content Новый контент.
   * @returns void
   */
  setContent(content: HTMLElement): void {
    this.content.innerHTML = "";
    this.content.appendChild(content);
  }

  /**
   * Отображает содержимое модального окна.
   * @param {HTMLElement} content - Контент для отображения.
   * @returns {HTMLElement} Элемент модального окна.
   */
  display(content: HTMLElement): HTMLElement {
    this.setContent(content);
    return this.container;
  }
}
