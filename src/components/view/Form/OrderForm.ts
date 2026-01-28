import { Form } from "./Form";
import { IEvents } from "../../base/Events";

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
        this.selectPayment(button.name);
        this.onInputChange();
      });
    });

    // Обработка изменения адреса
    this.addressInput.addEventListener("change", () => {
      this.validateForm();
      this.onInputChange();
    });
  }

  selectPayment(method: string): void {
    this.paymentButtons.forEach((btn) => {
      if (btn.name === method) {
        btn.classList.add("button_alt-active");
      } else {
        btn.classList.remove("button_alt-active");
      }
    });
  }

  validateForm(): void {
    const payment = this.paymentButtons.find((btn) =>
      btn.classList.contains("button_alt-active"),
    )?.name;
    const address = this.addressInput.value.trim();

    if (!address) {
      this.errorElement.textContent = "Необходимо указать адрес";
      this.submitBtn.disabled = true;
    } else if (!payment) {
      this.errorElement.textContent = "Необходимо выбрать способ оплаты";
      this.submitBtn.disabled = true;
    } else {
      this.errorElement.textContent = "";
      this.submitBtn.disabled = false;
    }
  }

  getData(): Record<string, string> {
    const payment = this.paymentButtons.find((btn) =>
      btn.classList.contains("button_alt-active"),
    )?.name;
    return {
      payment: payment || "",
      address: this.addressInput.value,
    };
  }

  protected onSubmit(): void {
    this.validateForm();
    if (!this.submitBtn.disabled) {
      const data = this.getData();
      this.events.emit("form:submit", data);
    }
  }
}
