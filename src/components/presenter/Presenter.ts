import { Products } from "../models/Products";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { EventEmitter } from "../base/Events";
import { Gallery } from "../view/Gallery";
import { Modal } from "../view/Modal";
import { Basket } from "../view/Basket";
import { Header } from "../view/Header";
import { CardPreview } from "../view/Card/CardPreview";
import { OrderForm } from "../view/Form/OrderForm";
import { ContactsForm } from "../view/Form/ContactsForm";
import { Success } from "../view/Success";
import { IProduct } from "../../types";

export class Presenter {
  protected products: Products;
  protected cart: Cart;
  protected order: Order;
  protected events: EventEmitter;

  protected gallery: Gallery;
  protected modal: Modal;
  protected basket: Basket;
  protected header: Header;
  protected currentBasket: Basket | null = null;

  constructor(
    products: Products,
    cart: Cart,
    order: Order,
    events: EventEmitter,
    gallery: Gallery,
    modal: Modal,
    basket: Basket,
    header: Header,
  ) {
    this.products = products;
    this.cart = cart;
    this.order = order;
    this.events = events;
    this.gallery = gallery;
    this.modal = modal;
    this.basket = basket;
    this.header = header;

    this.bindEvents();
  }

  protected bindEvents(): void {
    // Загрузка товаров
    this.events.on("products:loaded", (data: { products: IProduct[] }) => {
      this.products.setItems(data.products);
      this.gallery.display(this.products.getItems());
    });

    // Выбор товара
    this.events.on("card:select", (data: { id: string }) => {
      const product = this.products.getProductById(data.id);
      if (product) {
        this.products.setSelectedProduct(product);
        this.openPreview(product);
      }
    });

    // Добавление в корзину
    this.events.on("basket:add", (data: { id: string }) => {
      const product = this.products.getProductById(data.id);
      if (product && !this.cart.isProductInCart(product.id)) {
        this.cart.addProduct(product);
        this.updateBasketView();
        this.modal.close();
      }
    });

    // Удаление из корзины
    this.events.on("basket:remove", (data: { id: string }) => {
      this.cart.removeProduct(data.id);
      this.updateBasketView();
      // Обновляем открытый basket в modal'е если он есть
      if (this.currentBasket) {
        this.currentBasket.display(this.cart);
      }
    });

    // Открытие корзины
    this.events.on("basket:open", () => {
      const basketTemplate = document.querySelector(
        "#basket",
      ) as HTMLTemplateElement;
      const basketContainer = basketTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      this.currentBasket = new Basket(basketContainer, this.events);
      this.currentBasket.display(this.cart);
      this.modal.setContent(basketContainer);
      this.modal.open();
    });

    // Открытие оформления заказа
    this.events.on("order:open", () => {
      const orderTemplate = document.querySelector(
        "#order",
      ) as HTMLTemplateElement;
      const orderFormElement = orderTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      void new OrderForm(
        orderFormElement.querySelector("form") as HTMLElement,
        this.events,
      );
      this.modal.setContent(orderFormElement);
      this.modal.open();
    });

    // Отправка формы заказа
    this.events.on("form:submit", (data: Record<string, string>) => {
      if (data.address && data.payment) {
        this.order.setOrderData({
          payment: data.payment as any,
          email: "",
          phone: "",
          address: data.address,
        });
        this.openContactsForm();
      }
    });

    // Отправка контактов
    this.events.on("order:contact", (data: Record<string, string>) => {
      this.order.setOrderData({
        ...this.order.getOrderData(),
        email: data.email,
        phone: data.phone,
      });
      this.submitOrder();
    });

    // Закрытие успешного заказа
    this.events.on("success:close", () => {
      this.modal.close();
    });

    // Закрытие модального окна
    this.events.on("modal:close", () => {
      this.modal.close();
      this.currentBasket = null;
    });
  }

  protected updateBasketView(): void {
    this.basket.display(this.cart);
    this.header.display();
    this.header.setBasketCounter(this.cart.getItemCount());
  }

  protected openPreview(product: IProduct): void {
    const cardTemplate = document.querySelector(
      "#card-preview",
    ) as HTMLTemplateElement;
    const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardPreview(
      cardElement.querySelector(".card") as HTMLElement,
      this.events,
    );

    const inCart = this.cart.isProductInCart(product.id);
    card.setButtonText(inCart ? "Уже в корзине" : "Купить");
    card.setButtonState(inCart);

    card.display(product);
    this.modal.setContent(cardElement);
    this.modal.open();
  }

  protected openContactsForm(): void {
    const contactsTemplate = document.querySelector(
      "#contacts",
    ) as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    void new ContactsForm(
      contactsElement.querySelector("form") as HTMLElement,
      this.events,
    );
    this.modal.setContent(contactsElement);
  }

  protected submitOrder(): void {
    const successTemplate = document.querySelector(
      "#success",
    ) as HTMLTemplateElement;
    const successElement = successTemplate.content.cloneNode(
      true,
    ) as HTMLElement;

    const success = new Success(successElement, this.events);
    success.setTotal(this.cart.getTotalPrice());
    this.modal.setContent(successElement);

    this.cart.clearCart();
    this.updateBasketView();
  }
}
