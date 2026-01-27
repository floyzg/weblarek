import { IApi, IProduct, IOrder, IOrderResponse } from "../../types";

export class Server {
  constructor(private api: IApi) {}

  // Выборка продуктов с сервера
  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<{ items: IProduct[] }>("/product/");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
      throw error;
    }
  }

  // Оформление заказа
  async createOrder(order: IOrder): Promise<IOrderResponse> {
    try {
      const response = await this.api.post<IOrderResponse>('/order/', order);
      return response;
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      throw error;
    }
  }
}