import { IBuyer, TPayment } from "../../types";

export class Order {
 private data: IBuyer = {
  payment: "" as TPayment,
  email: "",
  phone: "",
  address: ""
 };

 setOrderData(data: Partial<IBuyer>): void {
  this.data = { ...this.data, ...data };
 } 

  getOrderData(): IBuyer {
  return this.data;
  }

  clearOrderData(): void {
  this.data = {
   payment: "" as TPayment,
   email: "",
   phone: "",
   address: ""
  };
 }

 validateOrderData(): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  if (!this.data.email || !/\S+@\S+\.\S+/.test(this.data.email)) {
   errors.email = "Некорректный email адрес";
  }

  if (!this.data.phone || !/^\+?[1-9]\d{1,14}$/.test(this.data.phone)) {
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