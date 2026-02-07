import { Api } from "./base/Api";
import { EventEmitter, IEvents } from "./base/Events";
import { Server } from "./models/Server";
import { Products } from "./models/Products";
import { Cart } from "./models/Cart";
import { Order } from "./models/Order";

import { Header } from "./views/Header";
import { Gallery } from "./views/Gallery";
import { Modal } from "./views/Modal";
import { Basket } from "./views/Basket";
import { CardPreview } from "./views/Card/CardPreview";
import { OrderForm } from "./views/Form/OrderForm";
import { ContactsForm } from "./views/Form/ContactsForm";
import { Success } from "./views/Success";

import type { IProduct, IOrder } from "../types";
import { API_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";

type ModalState = "none" | "preview" | "basket" | "order" | "contacts" | "success";

function must<T>(v: T | null, name: string): T {
  if (!v) throw new Error(`${name} not found`);
  return v;
}

function findProduct(products: Products, id: string): IProduct {
  const p = products.getProductById(id);
  if (!p) throw new Error(`Product not found: ${id}`);
  return p;
}

/**
 * Презентер приложения (MVP).
 *
 * Важно: презентер НЕ генерирует события — он только подписывается на события
 * от Представлений и Моделей и выполняет нужные действия.
 */
export class Presenter {
  private readonly events: IEvents;

  private readonly server: Server;
  private readonly products: Products;
  private readonly cart: Cart;
  private readonly order: Order;

  private readonly headerView: Header;
  private readonly galleryView: Gallery;
  private readonly modalView: Modal;

  private modalState: ModalState = "none";
  private selectedProductId: string | null = null;

  constructor() {
    // Брокер событий
    this.events = new EventEmitter();

    // Слой коммуникации (API/Server)
    const api = new Api(API_URL);
    this.server = new Server(api);

    // Модели данных
    this.products = new Products(this.events);
    this.cart = new Cart(this.events);
    this.order = new Order(this.events);

    // Корневые DOM-элементы
    const headerRoot = must(document.querySelector(".header"), ".header") as HTMLElement;
    const galleryRoot = must(document.querySelector(".gallery"), ".gallery") as HTMLElement;
    const modalRoot = must(document.querySelector(".modal"), ".modal") as HTMLElement;

    // Компоненты представления (View)
    this.headerView = new Header(headerRoot, this.events);
    this.galleryView = new Gallery(galleryRoot, this.events);
    this.modalView = new Modal(modalRoot, this.events);

    // Подписки на события
    this.bindViewEvents();
    this.bindModelEvents();
  }

  /** Запускает приложение: загружает каталог и настраивает реакцию интерфейса. */
  init(): void {
    this.loadCatalog();
  }

  /**
   * Загружает список товаров с сервера и сохраняет его в модель каталога.
   * Рендер каталога выполняется реакцией на событие модели `catalog:changed`.
   */
  private loadCatalog(): void {
    this.server
      .getProducts()
      .then((items) => this.products.setItems(items))
      .catch((err) => console.error("Ошибка при загрузке каталога:", err));
  }

  // ---------------------------
  // События Представления → действия Презентера
  // ---------------------------

  /**
   * Подписывается на события пользовательского интерфейса.
   * @returns void
   */
  private bindViewEvents(): void {
    this.events.on("card:select", ({ id }: { id: string }) => {
      this.selectedProductId = id;
      this.products.setSelectedProduct(findProduct(this.products, id));
    });

    this.events.on("basket:open", () => {
      this.openBasket();
    });

    // В CardPreview всегда эмитится событие `basket:add`,
    // поэтому здесь реализуем переключение: купить / удалить из корзины.
    this.events.on("basket:add", ({ id }: { id: string }) => {
      const product = findProduct(this.products, id);

      if (this.cart.isProductInCart(id)) {
        this.cart.removeProduct(id);
      } else {
        this.cart.addProduct(product);
      }

      // По требованиям: после действия модальное окно закрывается.
      this.modalView.close();
      this.modalState = "none";
    });

    this.events.on("basket:remove", ({ id }: { id: string }) => {
      this.cart.removeProduct(id);
    });

    this.events.on("order:open", () => {
      this.openOrderStep1();
    });

    this.events.on("form:change", (data: Record<string, string>) => {
      this.order.setOrderData(data);
    });

    this.events.on("form:submit", (data: Record<string, string>) => {
      this.order.setOrderData(data);
      this.openOrderStep2();
    });

    this.events.on("order:contact", (data: Record<string, string>) => {
      this.order.setOrderData(data);
      this.pay();
    });

    this.events.on("modal:close", () => {
      this.modalState = "none";
    });

    this.events.on("success:close", () => {
      this.modalView.close();
      this.modalState = "none";
    });
  }

  // ---------------------------
  // События Модели → обновление Представления
  // ---------------------------

  /**
   * Подписывается на события моделей и обновляет представления.
   * @returns void
   */
  private bindModelEvents(): void {
    this.events.on("catalog:changed", () => {
      this.galleryView.display(this.products.getItems());
    });

    this.events.on("product:selected", ({ id }: { id: string }) => {
      this.openPreview(findProduct(this.products, id));
    });

    this.events.on("cart:changed", () => {
      this.headerView.setBasketCounter(this.cart.getItemCount());

      // Если сейчас открыта корзина — перерисуем её по событию модели (это разрешено требованиями).
      if (this.modalState === "basket") {
        this.openBasket();
      }

      // Если открыт предпросмотр — обновим текст кнопки (Купить/Удалить).
      if (this.modalState === "preview" && this.selectedProductId) {
        this.openPreview(findProduct(this.products, this.selectedProductId));
      }
    });

    this.events.on("order:changed", () => {
      // Формы валидируют себя сами, но событие изменения данных покупателя обязано существовать.
    });
  }

  // ---------------------------
  // Хелперы открытия модальных окон
  // ---------------------------

  /**
   * Открывает модальное окно предпросмотра товара.
   * @param product Товар для предпросмотра.
   * @returns void
   */
  private openPreview(product: IProduct): void {
    const previewEl = cloneTemplate<HTMLElement>("#card-preview");
    const preview = new CardPreview(previewEl, this.events);

    preview.display(product);

    // Кнопка по требованиям: Недоступно / Купить / Удалить.
    if (product.price === null) {
      preview.setButtonText("Недоступно");
      preview.setButtonState(true);
    } else {
      const inCart = this.cart.isProductInCart(product.id);
      preview.setButtonText(inCart ? "Удалить из корзины" : "Купить");
      preview.setButtonState(false);
    }

    this.modalView.setContent(preview.display(product));
    this.modalView.open();
    this.modalState = "preview";
  }

  /**
   * Открывает модальное окно корзины.
   * @returns void
   */
  private openBasket(): void {
    const basketEl = cloneTemplate<HTMLElement>("#basket");
    const basketView = new Basket(basketEl, this.events);

    this.modalView.setContent(basketView.display(this.cart));
    this.modalView.open();
    this.modalState = "basket";
  }

  /**
   * Открывает модальное окно формы заказа (шаг 1).
   * @returns void
   */
  private openOrderStep1(): void {
    const orderEl = cloneTemplate<HTMLElement>("#order");
    const orderForm = new OrderForm(orderEl, this.events);

    this.modalView.setContent(orderForm.display());
    this.modalView.open();
    this.modalState = "order";
  }

  /**
   * Открывает модальное окно формы ввода контактов (шаг 2).
   * @returns void
   */
  private openOrderStep2(): void {
    const contactsEl = cloneTemplate<HTMLElement>("#contacts");
    const contactsForm = new ContactsForm(contactsEl, this.events);

    this.modalView.setContent(contactsForm.display());
    this.modalView.open();
    this.modalState = "contacts";
  }

  /**
   * Открывает окно успешного оформления заказа.
   * @param total Итоговая сумма заказа.
   * @returns void
   */
  private openSuccess(total: number): void {
    const successEl = cloneTemplate<HTMLElement>("#success");
    const successView = new Success(successEl, this.events);

    successView.setTotal(total);

    this.modalView.setContent(successView.display());
    this.modalView.open();
    this.modalState = "success";
  }

  // ---------------------------
  // Оплата и отправка заказа
  // ---------------------------

  /**
   * Отправляет заказ на сервер и открывает окно успеха.
   * @returns void
   */
  private pay(): void {
    const buyer = this.order.getOrderData();

    const payload: IOrder = {
      ...buyer,
      items: this.cart.getProducts().map((p) => p.id),
      total: this.cart.getTotalPrice(),
    } as unknown as IOrder;

    this.server
      .createOrder(payload)
      .then(() => {
        const total = this.cart.getTotalPrice();
        this.openSuccess(total);

        // Модели сами эмитят события об изменениях.
        this.cart.clearCart();
        this.order.clearOrderData();
      })
      .catch((err) => console.error("Ошибка при оформлении заказа:", err));
  }
}