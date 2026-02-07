import { Form } from "./Form";
import { IEvents } from "../../base/Events";

/**
 * Форма оформления заказа (шаг 1).
 * Не валидирует данные и не хранит их — только эмитит изменения выбора оплаты/адреса.
 * Валидация выполняется в модели Order, а ошибки прокидываются презентером.
 */
export class OrderForm extends Form {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  protected submitBtn: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.paymentButtons = Array.from(
      this.container.querySelectorAll('[name="card"], [name="cash"]'),
    ) as HTMLButtonElement[];
    this.addressInput = this.container.querySelector(
      '[name="address"]',
    ) as HTMLInputElement;
    this.submitBtn = this.container.querySelector(
      '[type="submit"]',
    ) as HTMLButtonElement;
    this.errorElement = this.container.querySelector(
      ".form__errors",
    ) as HTMLElement;

    // Обработка выбора способа оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // Переключаем активную кнопку оплаты (это только UI-состояние формы)
        this.selectPayment(button.name);
        this.events.emit("form:change", {
          field: "payment",
          value: button.name,
        });
      });
    });

    // Обработка изменения адреса
    this.addressInput.addEventListener("input", () => {
      this.events.emit("form:change", {
        field: "address",
        value: this.addressInput.value,
      });
    });
  }

  /**
   * Отмечает выбранный способ оплаты.
   * @param method Название метода оплаты.
   * @returns void
   */
  selectPayment(method: string): void {
    this.paymentButtons.forEach((btn) => {
      if (btn.name === method) {
        btn.classList.add("button_alt-active");
      } else {
        btn.classList.remove("button_alt-active");
      }
    });
  }

  /**
   * Обрабатывает отправку формы заказа.
   * @returns void
   */
  protected onSubmit(): void {
    // Форма не является источником данных при отправке
    this.events.emit("form:submit");
  }

  setPayment(method: string): void {
    if (!method) {
      this.paymentButtons.forEach((btn) =>
        btn.classList.remove("button_alt-active"),
      );
      return;
    }
    this.selectPayment(method);
  }

  setAddress(address: string): void {
    this.addressInput.value = address ?? "";
  }
}
