import "./scss/styles.scss";
import { Presenter } from "./components/Presenter";

// Facade для инициализации приложения
const presenter = new Presenter();
presenter.init();

// test code for models and server

// const exampleIDProduct = "854cef69-976d-4c2a-a18c-2aa45046c390";
// console.log("Тестирование модели Products");
// productsModel.setItems(apiProducts.items);
// console.log("Все товары:", productsModel.getItems());
// console.log(
//   "Товар с указанным ID:",
//   productsModel.getProductById(exampleIDProduct),
// );

// if (productsModel.getProductById(exampleIDProduct)) {
//   productsModel.setSelectedProduct(
//     productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")!,
//   );
//   console.log("Выбранный товар:", productsModel.getSelectedProduct());
// }

// console.log("Тестирование модели Cart");
// cartModel.addProduct(apiProducts.items[0]);
// cartModel.addProduct(apiProducts.items[1]);
// console.log("Товары в корзине после добавления:", cartModel.getProducts());
// console.log(
//   "Находится ли товар в корзине:",
//   cartModel.isProductInCart(exampleIDProduct),
// );
// console.log("Общая стоимость:", cartModel.getTotalPrice());
// console.log("Количество товаров:", cartModel.getItemCount());
// cartModel.removeProduct(exampleIDProduct);
// console.log("Товары в корзине после удаления:", cartModel.getProducts());
// cartModel.clearCart();
// console.log("Корзина после очистки:", cartModel.getProducts());

// console.log("Тестирование модели Order");
// orderModel.setOrderData({
//   payment: "card",
//   email: "",
//   phone: "+1234567890",
//   address: "123 Main St",
// });
// console.log("Данные заказа:", orderModel.getOrderData());
// console.log("Ошибки валидации:", orderModel.validateOrderData());
// orderModel.clearOrderData();
// console.log("Данные заказа после очистки:", orderModel.getOrderData());

// console.log("Тестирование сервера");

// server
//   .getProducts()
//   .then((productsFromServer) => {
//     console.log("✅");
//     console.log("Количество товаров:", productsFromServer.length);
//     console.log("Список товаров:", productsFromServer);

//     // сохраняем полученные с сервера товары в Products
//     productsModel.setItems(productsFromServer);

//     console.log("Товары, сохранённые в модели:", productsModel.getItems());
//   })
//   .catch((error) =>
//     console.error(`Ошибка при получении товаров с сервера: ${error}`),
//   );

// console.log("Тестирование завершено");
