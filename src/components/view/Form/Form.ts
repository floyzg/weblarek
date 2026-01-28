import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export class Form extends Component<HTMLElement> {
  protected inputs: HTMLInputElement[];
  protected submitButton: HTMLButtonElement;
  protected events: IEvents;
  protected errors: Record<string, string> = {};

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
      e.preventDefault();
      this.onSubmit();
    });

    this.inputs.forEach((input) => {
      input.addEventListener("change", () => this.onInputChange());
    });
  }

  protected onSubmit(): void {
    const data = this.getData();
    this.events.emit("form:submit", data);
  }

  protected onInputChange(): void {
    const data = this.getData();
    this.events.emit("form:change", data);
  }

  getData(): Record<string, string> {
    const data: Record<string, string> = {};
    this.inputs.forEach((input) => {
      data[input.name] = input.value;
    });
    return data;
  }

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

  clearErrors(): void {
    this.inputs.forEach((input) => {
      input.classList.remove("form__input_error");
    });
    this.errors = {};
  }

  display(): HTMLElement {
    return this.container;
  }
}
