import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import type { FormViewData } from "../../../types";

/**
 * Базовый класс формы.
 * Не хранит данные и не валидирует их — форма лишь эмитит события ввода/отправки
 * и отображает ошибки, которые пришли из модели через презентер.
 */
export class Form extends Component<FormViewData> {
  protected inputs: HTMLInputElement[];
  protected submitButton: HTMLButtonElement;
  protected events: IEvents;

  /**
   * @param container Корневой элемент формы (из template).
   * @param events Брокер событий для общения с презентером.
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.inputs = Array.from(
      this.container.querySelectorAll("input"),
    ) as HTMLInputElement[];
    this.submitButton = this.container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    this.container.addEventListener("submit", (e: SubmitEvent) => {
      // Отменяем нативную отправку и работаем через события (MVP)
      e.preventDefault();
      this.onSubmit();
    });

    this.inputs.forEach((input) => {
      // При каждом вводе сообщаем презентеру только изменённое поле
      input.addEventListener("input", () => this.onInputChange(input));
    });
  }

  /**
   * Отправляет событие отправки формы (без данных).
   * @returns void
   */
  protected onSubmit(): void {
    // Форма не является источником данных при отправке
    this.events.emit("form:submit");
  }

  /**
   * Обрабатывает изменение одного поля формы.
   * @param input Изменённый input.
   * @returns void
   */
  protected onInputChange(input: HTMLInputElement): void {
    this.events.emit("form:change", { field: input.name, value: input.value });
  }

  /**
   * Устанавливает ошибки для полей и отображает сообщения в .form__errors, если есть.
   * @param errors Объект ошибок.
   * @returns void
   */
  setErrors(errors: Record<string, string>): void {
    this.inputs.forEach((input) => {
      if (errors[input.name]) {
        input.classList.add("form__input_error");
      } else {
        input.classList.remove("form__input_error");
      }
    });

    const errorsEl = this.container.querySelector(
      ".form__errors",
    ) as HTMLElement | null;
    if (errorsEl) {
      errorsEl.textContent = Object.values(errors).filter(Boolean).join("\n");
    }
  }

  /**
   * Управляет доступностью кнопки отправки.
   * @param enabled true, если кнопку можно нажимать
   */
  setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
}
