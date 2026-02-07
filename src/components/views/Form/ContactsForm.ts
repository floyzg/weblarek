import { Form } from "./Form";
import { IEvents } from "../../base/Events";

/**
 * Форма ввода контактных данных покупателя.
 * Не валидирует данные — только эмитит изменения полей.
 * Валидация выполняется в модели Order, а ошибки прокидываются презентером.
 */
export class ContactsForm extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitBtn: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.emailInput = this.container.querySelector(
      '[name="email"]',
    ) as HTMLInputElement;
    this.phoneInput = this.container.querySelector(
      '[name="phone"]',
    ) as HTMLInputElement;
    this.submitBtn = this.container.querySelector(
      '[type="submit"]',
    ) as HTMLButtonElement;
    this.errorElement = this.container.querySelector(
      ".form__errors",
    ) as HTMLElement;

    this.emailInput.addEventListener("input", () => {
      this.onInputChange(this.emailInput);
    });

    this.phoneInput.addEventListener("input", () => {
      this.onInputChange(this.phoneInput);
    });
  }

  // validateForm and getData removed, see reviewer requirements.

  /**
   * Обрабатывает отправку формы контактов.
   * @returns void
   */
  protected onSubmit(): void {
    // Форма не является источником данных при отправке
    this.events.emit("order:contact");
  }

  setEmail(email: string): void {
    this.emailInput.value = email ?? "";
  }

  setPhone(phone: string): void {
    this.phoneInput.value = phone ?? "";
  }
}
