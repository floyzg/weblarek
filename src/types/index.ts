export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // arr of product ID
}

export interface IOrderResponse {
  orderId: string;
  total: number;
}

export interface IOrderForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderData extends IOrderForm {
  total: number;
  items: string[];
}

export type CardViewData = {
  title: string;
  price: number | null;
  id: string;
};

export type FormViewData = {
  errors: Record<string, string>;
  submitEnabled: boolean;
};

export type GalleryViewData = {
  items: HTMLElement[];
};

export type ModalViewData = {
  content: HTMLElement;
  opened: boolean;
};

export type SuccessViewData = {
  total: number;
};

export type BasketViewData = {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
};
export type HeaderViewData = {
  counter: number;
};