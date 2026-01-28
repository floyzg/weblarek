import "./scss/styles.scss";

import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Order } from "./components/models/Order";
import { Api } from "./components/base/Api";
import { Server } from "./components/base/Server";
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";

import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { Header } from "./components/view/Header";
import { Presenter } from "./components/presenter/Presenter";

const api = new Api(API_URL);
const server = new Server(api);
const events = new EventEmitter();

const productsModel = new Products();
const cartModel = new Cart();
const orderModel = new Order();

const galleryContainer = document.querySelector(".gallery") as HTMLElement;
const modalContainer = document.querySelector(".modal") as HTMLElement;
const headerContainer = document.querySelector(".header") as HTMLElement;

// Создаём контейнер для корзины из шаблона
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement;

const gallery = new Gallery(galleryContainer, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketContainer, events);
const header = new Header(headerContainer, events);

void new Presenter(
  productsModel,
  cartModel,
  orderModel,
  events,
  gallery,
  modal,
  basket,
  header,
);

server
  .getProducts()
  .then((products) => {
    events.emit("products:loaded", { products });
  })
  .catch((error) => console.error(`Ошибка загрузки товаров: ${error}`));
