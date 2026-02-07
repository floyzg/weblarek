import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

/**
 * Базовый класс формы.
 * Управляет сбором данных, валидацией и отправкой.
 */
export class Form extends Component<HTMLElement> {
  protected inputs: HTMLInputElement[];
  protected submitButton: HTMLButtonElement;
  protected events: IEvents;
  protected errors: Record<string, string> = {};

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
      // При каждом изменении поля отправляем частичные данные в презентер
      input.addEventListener("change", () => this.onInputChange());
    });
  }

  /**
   * Отправляет данные формы через событие.
   * @returns void
   */
  protected onSubmit(): void {
    const data = this.getData();
    this.events.emit("form:submit", data);
  }

  /**
   * Обрабатывает изменение данных формы.
   * @returns void
   */
  protected onInputChange(): void {
    const data = this.getData();
    this.events.emit("form:change", data);
  }

  /**
   * Получает данные формы.
   * @returns Данные всех полей.
   */
  getData(): Record<string, string> {
    const data: Record<string, string> = {};
    this.inputs.forEach((input) => {
      data[input.name] = input.value;
    });
    return data;
  }

  /**
   * Устанавливает ошибки для полей.
   * @param errors Объект ошибок.
   * @returns void
   */
  setErrors(errors: Record<string, string>): void {
    this.errors = errors;
    this.inputs.forEach((input) => {
      if (errors[input.name]) {
        input.classList.add("form__input_error");
      } else {
        input.classList.remove("form__input_error");
      }
    });
  }

  /**
   * Очищает все ошибки формы.
   * @returns void
   */
  clearErrors(): void {
    this.inputs.forEach((input) => {
      input.classList.remove("form__input_error");
    });
    this.errors = {};
  }

  /**
   * Отображает форму.
   * @returns Элемент формы.
   */
  display(): HTMLElement {
    return this.container;
  }
}
