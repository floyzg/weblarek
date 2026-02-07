import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { Server } from "./components/models/Server";
import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Order } from "./components/models/Order";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { CardPreview } from "./components/views/Card/CardPreview";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";
import { Success } from "./components/views/Success";

import { Presenter } from "./components/Presenter";
import { API_URL } from "./utils/constants";
import { cloneTemplate } from "./utils/utils";

function must<T>(v: T | null, name: string): T {
  if (!v) throw new Error(`${name} not found`);
  return v;
}

const events = new EventEmitter();

// Слой коммуникации (API/Server)
const api = new Api(API_URL);
const server = new Server(api);

// Модели
const products = new Products(events);
const cart = new Cart(events);
const order = new Order(events);

// Корневые элементы приложения
const headerRoot = must(
  document.querySelector(".header"),
  ".header",
) as HTMLElement;
const galleryRoot = must(
  document.querySelector(".gallery"),
  ".gallery",
) as HTMLElement;
const modalRoot = must(
  document.querySelector(".modal"),
  ".modal",
) as HTMLElement;

// Корневые View
const headerView = new Header(headerRoot, events);
const galleryView = new Gallery(galleryRoot, events);
const modalView = new Modal(modalRoot, events);

// Статичные модальные View (создаются один раз)
const basketView = new Basket(cloneTemplate<HTMLElement>("#basket"), events);
const previewView = new CardPreview(
  cloneTemplate<HTMLElement>("#card-preview"),
  events,
);
const orderFormView = new OrderForm(
  cloneTemplate<HTMLElement>("#order"),
  events,
);
const contactsFormView = new ContactsForm(
  cloneTemplate<HTMLElement>("#contacts"),
  events,
);
const successView = new Success(cloneTemplate<HTMLElement>("#success"), events);

const presenter = new Presenter({
  events,
  server,
  products,
  cart,
  order,
  headerView,
  galleryView,
  modalView,
  basketView,
  previewView,
  orderFormView,
  contactsFormView,
  successView,
});

presenter.init();
