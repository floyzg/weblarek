import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

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
      if (e.target === this.container) {
        this.close();
        events.emit("modal:close");
      }
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }

  setContent(content: HTMLElement): void {
    this.content.innerHTML = "";
    this.content.appendChild(content);
  }

  display(content: HTMLElement): HTMLElement {
    this.setContent(content);
    return this.container;
  }
}
