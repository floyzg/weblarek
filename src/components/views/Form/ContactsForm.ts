import { Form } from "./Form";
import { IEvents } from "../../base/Events";

/**
 * Форма ввода контактных данных покупателя.
 * Валидирует email и телефон, отправляет данные заказа.
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

    this.emailInput.addEventListener("change", () => {
      this.validateForm();
      this.onInputChange();
    });

    this.phoneInput.addEventListener("change", () => {
      this.validateForm();
      this.onInputChange();
    });
  }

  /**
   * Валидирует форму контактов.
   * Блокирует кнопку отправки и отображает ошибки.
   */
  validateForm(): void {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s()\-]{10,}$/;

    if (!email) {
      this.errorElement.textContent = "Необходимо указать email";
      this.submitBtn.disabled = true;
      return;
    }

    if (!emailRegex.test(email)) {
      this.errorElement.textContent = "Некорректный email";
      this.submitBtn.disabled = true;
      return;
    }

    if (!phone) {
      this.errorElement.textContent = "Необходимо указать телефон";
      this.submitBtn.disabled = true;
      return;
    }

    if (!phoneRegex.test(phone)) {
      this.errorElement.textContent = "Некорректный номер телефона";
      this.submitBtn.disabled = true;
      return;
    }

    this.errorElement.textContent = "";
    this.submitBtn.disabled = false;
  }

  /**
   * Получает данные формы контактов.
   * @returns {Record<string, string>} Email и телефон.
   */
  getData(): Record<string, string> {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  /**
   * Обрабатывает отправку формы контактов.
   */
  protected onSubmit(): void {
    this.validateForm();
    if (!this.submitBtn.disabled) {
      const data = this.getData();
      this.events.emit("order:contact", data);
    }
  }
}
