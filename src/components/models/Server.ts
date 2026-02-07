import { IApi, IProduct, IOrder, IOrderResponse } from "../../types";

/**
 * Обёртка над API.
 * Отвечает только за сетевые запросы к серверу (без логики UI).
 */
export class Server {
  constructor(private api: IApi) {}

  /**
   * Получает список товаров с сервера.
   * @returns Промис с массивом товаров.
   * @throws Пробрасывает ошибку запроса.
   */
  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<{ items: IProduct[]; total: number }>("/product/");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
      throw error;
    }
  }

  /**
   * Отправляет заказ на сервер.
   * @param order Данные заказа.
   * @returns Промис с ответом сервера по заказу.
   * @throws Пробрасывает ошибку запроса.
   */
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