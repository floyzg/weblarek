import { Server } from "./models/Server";
import { Products } from "./models/Products";
import { Cart } from "./models/Cart";
import { Order } from "./models/Order";

import { Header } from "./views/Header";
import { Gallery } from "./views/Gallery";
import { Modal } from "./views/Modal";
import { Basket } from "./views/Basket";
import { CardBasket } from "./views/Card/CardBasket";
import { CardPreview } from "./views/Card/CardPreview";
import { CardCatalog } from "./views/Card/CardCatalog";
import { OrderForm } from "./views/Form/OrderForm";
import { ContactsForm } from "./views/Form/ContactsForm";
import { Success } from "./views/Success";

import { cloneTemplate } from "../utils/utils";
import type { IEvents } from "./base/Events";
import type { IProduct, IOrder } from "../types";
import { CDN_URL } from "../utils/constants";

type ModalState =
  | "none"
  | "preview"
  | "basket"
  | "order"
  | "contacts"
  | "success";

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
  private readonly basketView: Basket;

  private readonly previewView: CardPreview;
  private readonly orderFormView: OrderForm;
  private readonly contactsFormView: ContactsForm;
  private readonly successView: Success;

  private modalState: ModalState = "none";

  constructor(deps: {
    events: IEvents;
    server: Server;
    products: Products;
    cart: Cart;
    order: Order;
    headerView: Header;
    galleryView: Gallery;
    modalView: Modal;
    basketView: Basket;
    previewView: CardPreview;
    orderFormView: OrderForm;
    contactsFormView: ContactsForm;
    successView: Success;
  }) {
    this.events = deps.events;

    this.server = deps.server;
    this.products = deps.products;
    this.cart = deps.cart;
    this.order = deps.order;

    this.headerView = deps.headerView;
    this.galleryView = deps.galleryView;
    this.modalView = deps.modalView;

    this.basketView = deps.basketView;
    this.previewView = deps.previewView;
    this.orderFormView = deps.orderFormView;
    this.contactsFormView = deps.contactsFormView;
    this.successView = deps.successView;

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
      .then((items) =>
        this.products.setItems(
          items.map((item) => ({
            ...item,
            image:
              item.image && /^https?:\/\//.test(item.image)
                ? item.image
                : `${CDN_URL}${item.image}`,
          })),
        ),
      )
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
      this.products.setSelectedProduct(findProduct(this.products, id));
    });

    this.events.on("basket:open", () => {
      this.openBasket();
    });

    // В CardPreview эмитится событие `basket:toggle`,
    // поэтому здесь реализуем переключение: купить / удалить из корзины.
    this.events.on("basket:toggle", () => {
      // Берём текущий выбранный продукт из модели.
      const product = this.products.getSelectedProduct();
      if (!product) return;

      const id = product.id;

      if (this.cart.isProductInCart(id)) {
        this.cart.removeProduct(id);
      } else {
        this.cart.addProduct(product);
      }

      this.modalView.close();
      this.modalState = "none";
    });

    this.events.on("basket:remove", ({ id }: { id: string }) => {
      this.cart.removeProduct(id);
    });

    this.events.on("order:open", () => {
      this.openOrderStep1();
    });

    this.events.on("form:change", (data: { field: string; value: string }) => {
      this.order.setOrderData({ [data.field]: data.value });
    });

    this.events.on("form:submit", () => {
      this.openOrderStep2();
    });

    this.events.on("order:contact", () => {
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
      const items = this.products.getItems().map((product) => {
        const root = cloneTemplate<HTMLElement>("#card-catalog");

        const cardEl = root.classList.contains("card")
          ? root
          : (root.querySelector(".card") as HTMLElement | null);

        if (!cardEl) {
          throw new Error(".card not found in #card-catalog template");
        }

        const card = new CardCatalog(cardEl, this.events);
        card.setTitle(product.title);
        card.setImageUrl(product.image, product.title);
        card.setPrice(product.price);
        card.setCategory(product.category);
        card.setId(product.id);

        return root;
      });

      this.galleryView.items = items;
    });

    this.events.on("product:selected", ({ id }: { id: string }) => {
      this.openPreview(findProduct(this.products, id));
    });

    this.events.on("cart:changed", () => {
      this.headerView.setBasketCounter(this.cart.getItemCount());
      this.updateBasketView();

      // Если сейчас открыта корзина — перерисуем её по событию модели.
      if (this.modalState === "basket") {
        this.openBasket();
      }
    });

    this.events.on("order:changed", () => {
      const buyer = this.order.getOrderData();
      const errors = this.order.validateOrderData();

      if (this.modalState === "order") {
        this.orderFormView.setErrors({
          payment: errors.payment || "",
          address: errors.address || "",
        });
        this.orderFormView.setSubmitEnabled(!errors.payment && !errors.address);

        this.orderFormView.setPayment(buyer.payment);
        this.orderFormView.setAddress(buyer.address);
      }

      if (this.modalState === "contacts") {
        this.contactsFormView.setErrors({
          email: errors.email || "",
          phone: errors.phone || "",
        });
        this.contactsFormView.setSubmitEnabled(!errors.email && !errors.phone);

        this.contactsFormView.setEmail(buyer.email);
        this.contactsFormView.setPhone(buyer.phone);
      }
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
    const preview = this.previewView;

    // Кнопка по требованиям: Недоступно / Купить / Удалить.
    if (product.price === null) {
      preview.setButtonText("Недоступно");
      preview.disabled = true;
    } else {
      const inCart = this.cart.isProductInCart(product.id);
      preview.setButtonText(inCart ? "Удалить из корзины" : "Купить");
      preview.disabled = false;
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
    this.updateBasketView();

    this.modalView.setContent(this.basketView.render());
    this.modalView.open();
    this.modalState = "basket";
  }

  private updateBasketView(): void {
    const items = this.cart.getProducts().map((product, index) => {
      const itemEl = cloneTemplate<HTMLElement>("#card-basket");
      const card = new CardBasket(itemEl, this.events);
      return card.display(product, index + 1);
    });

    this.basketView.items = items;
    this.basketView.total = this.cart.getTotalPrice();
    this.basketView.disabled = items.length === 0;
  }

  /**
   * Открывает модальное окно формы заказа (шаг 1).
   * @returns void
   */
  private openOrderStep1(): void {
    const errors = this.order.validateOrderData();
    this.orderFormView.setErrors({
      payment: errors.payment || "",
      address: errors.address || "",
    });
    this.orderFormView.setSubmitEnabled(!errors.payment && !errors.address);

    this.modalView.setContent(this.orderFormView.render());
    this.modalView.open();
    this.modalState = "order";
  }

  /**
   * Открывает модальное окно формы ввода контактов (шаг 2).
   * @returns void
   */
  private openOrderStep2(): void {
    const errors = this.order.validateOrderData();
    this.contactsFormView.setErrors({
      email: errors.email || "",
      phone: errors.phone || "",
    });
    this.contactsFormView.setSubmitEnabled(!errors.email && !errors.phone);

    this.modalView.setContent(this.contactsFormView.render());
    this.modalView.open();
    this.modalState = "contacts";
  }

  /**
   * Открывает окно успешного оформления заказа.
   * @param total Итоговая сумма заказа.
   * @returns void
   */
  private openSuccess(total: number): void {
    this.successView.setTotal(total);

    this.modalView.setContent(this.successView.render());
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
      .then((res) => {
        const total = (res as any).total ?? this.cart.getTotalPrice();
        this.openSuccess(total);

        // Модели сами эмитят события об изменениях.
        this.cart.clearCart();
        this.order.clearOrderData();
      })
      .catch((err) => console.error("Ошибка при оформлении заказа:", err));
  }
}
