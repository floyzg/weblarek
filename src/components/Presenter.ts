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
 * Важно: презентер НЕ генерирует события — только слушает и реагирует.
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
    // broker
    this.events = new EventEmitter();

    // api/server
    const api = new Api(API_URL);
    this.server = new Server(api);

    // models
    this.products = new Products(this.events);
    this.cart = new Cart(this.events);
    this.order = new Order(this.events);

    // roots
    const headerRoot = must(document.querySelector(".header"), ".header") as HTMLElement;
    const galleryRoot = must(document.querySelector(".gallery"), ".gallery") as HTMLElement;
    const modalRoot = must(document.querySelector(".modal"), ".modal") as HTMLElement;

    // views
    this.headerView = new Header(headerRoot, this.events);
    this.galleryView = new Gallery(galleryRoot, this.events);
    this.modalView = new Modal(modalRoot, this.events);

    // subs
    this.bindViewEvents();
    this.bindModelEvents();
  }

  init(): void {
    this.loadCatalog();
  }

  private loadCatalog(): void {
    this.server
      .getProducts()
      .then((items) => this.products.setItems(items))
      .catch((err) => console.error("Products error:", err));
  }

  // ---------------------------
  // View -> Presenter
  // ---------------------------

  private bindViewEvents(): void {
    this.events.on("card:select", ({ id }: { id: string }) => {
      this.selectedProductId = id;
      this.products.setSelectedProduct(findProduct(this.products, id));
    });

    this.events.on("basket:open", () => {
      this.openBasket();
    });

    // В твоём CardPreview событие называется basket:add всегда,
    // поэтому здесь делаем toggle купить/удалить.
    this.events.on("basket:add", ({ id }: { id: string }) => {
      const product = findProduct(this.products, id);

      if (this.cart.isProductInCart(id)) {
        this.cart.removeProduct(id);
      } else {
        this.cart.addProduct(product);
      }

      // требование: после действия модалка закрывается
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
  // Model -> Presenter
  // ---------------------------

  private bindModelEvents(): void {
    this.events.on("catalog:changed", () => {
      this.galleryView.display(this.products.getItems());
    });

    this.events.on("product:selected", ({ id }: { id: string }) => {
      this.openPreview(findProduct(this.products, id));
    });

    this.events.on("cart:changed", () => {
      this.headerView.setBasketCounter(this.cart.getItemCount());

      // если корзина открыта — перерисуем её (по событию модели, это разрешено)
      if (this.modalState === "basket") {
        this.openBasket();
      }

      // если открыт preview — обновим кнопку (текст Купить/Удалить)
      if (this.modalState === "preview" && this.selectedProductId) {
        this.openPreview(findProduct(this.products, this.selectedProductId));
      }
    });

    this.events.on("order:changed", () => {
      // формы валидируют себя сами, но событие обязано существовать
    });
  }

  // ---------------------------
  // Modal helpers
  // ---------------------------

  private openPreview(product: IProduct): void {
    const previewEl = cloneTemplate<HTMLElement>("#card-preview");
    const preview = new CardPreview(previewEl, this.events);

    preview.display(product);

    // кнопка по требованиям
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

  private openBasket(): void {
    const basketEl = cloneTemplate<HTMLElement>("#basket");
    const basketView = new Basket(basketEl, this.events);

    this.modalView.setContent(basketView.display(this.cart));
    this.modalView.open();
    this.modalState = "basket";
  }

  private openOrderStep1(): void {
    const orderEl = cloneTemplate<HTMLElement>("#order");
    const orderForm = new OrderForm(orderEl, this.events);

    this.modalView.setContent(orderForm.display());
    this.modalView.open();
    this.modalState = "order";
  }

  private openOrderStep2(): void {
    const contactsEl = cloneTemplate<HTMLElement>("#contacts");
    const contactsForm = new ContactsForm(contactsEl, this.events);

    this.modalView.setContent(contactsForm.display());
    this.modalView.open();
    this.modalState = "contacts";
  }

  private openSuccess(total: number): void {
    const successEl = cloneTemplate<HTMLElement>("#success");
    const successView = new Success(successEl, this.events);

    successView.setTotal(total);

    this.modalView.setContent(successView.display());
    this.modalView.open();
    this.modalState = "success";
  }

  // ---------------------------
  // Payment
  // ---------------------------

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

        // модели сами эмитят события
        this.cart.clearCart();
        this.order.clearOrderData();
      })
      .catch((err) => console.error("Order error:", err));
  }
}