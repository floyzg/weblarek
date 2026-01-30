import { IBuyer, TPayment } from "../../types";

/**
 * Модель заказа.
 * Хранит и валидирует данные покупателя и способ оплаты.
 */
export class Order {
 private data: IBuyer = {
  payment: "" as TPayment,
  email: "",
  phone: "",
  address: ""
 };

 /**
  * Устанавливает или обновляет данные заказа.
  * @param {Partial<IBuyer>} data - Частичные данные заказа.
  */
 setOrderData(data: Partial<IBuyer>): void {
  this.data = { ...this.data, ...data };
 } 

 /**
  * Возвращает текущие данные заказа.
  * @returns {IBuyer} Данные заказа.
  */
  getOrderData(): IBuyer {
  return this.data;
  }

  /**
   * Очищает данные заказа.
   */
  clearOrderData(): void {
  this.data = {
   payment: "" as TPayment,
   email: "",
   phone: "",
   address: ""
  };
 }

 /**
  * Валидирует данные заказа.
  * @returns {Record<string, string>} Объект ошибок, если есть.
  */
 validateOrderData(): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  if (!this.data.email) {
   errors.email = "Некорректный email адрес";
  }

  if (!this.data.phone) {
   errors.phone = "Некорректный номер телефона";
  }

  if (!this.data.address || this.data.address.trim().length === 0) {
   errors.address = "Необходимо указать адрес доставки";
  }

  if (!this.data.payment || (this.data.payment !== "card" && this.data.payment !== "cash")) {
   errors.payment = "Необходимо выбрать способ оплаты";
  }

  return errors;
 }
}