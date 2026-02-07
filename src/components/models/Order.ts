import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Модель оформления заказа.
 * Хранит данные покупателя (оплата, адрес, контакты) и выполняет валидацию.
 * 
 * При любом изменении данных эмитит событие `order:changed`.
 */
export class Order {
  constructor(private events?: IEvents) {}

  private data: IBuyer = {
    payment: "" as TPayment,
    email: "",
    phone: "",
    address: "",
  };

  /**
   * Частично обновляет данные заказа.
   * Эмитит `order:changed`.
   * @param data Объект с изменёнными полями.
   */
  setOrderData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events?.emit("order:changed", { ...this.data });
  }

  /**
   * Возвращает текущие данные заказа.
   * @returns Данные покупателя.
   */
  getOrderData(): IBuyer {
    return this.data;
  }

  /**
   * Сбрасывает данные заказа к значениям по умолчанию.
   * Эмитит `order:changed`.
   */
  clearOrderData(): void {
    this.data = {
      payment: "" as TPayment,
      email: "",
      phone: "",
      address: "",
    };
    this.events?.emit("order:changed", { ...this.data });
  }

  /**
   * Валидирует данные заказа.
   * @returns Объект ошибок, где ключ — имя поля, значение — текст ошибки.
   */
  validateOrderData(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (!this.data.email) errors.email = "Некорректный email адрес";
    if (!this.data.phone) errors.phone = "Некорректный номер телефона";
    if (!this.data.address || this.data.address.trim().length === 0) {
      errors.address = "Необходимо указать адрес доставки";
    }
    if (
      !this.data.payment ||
      (this.data.payment !== "card" && this.data.payment !== "cash")
    ) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }

    return errors;
  }
}
