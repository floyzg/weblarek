import "./scss/styles.scss";

import { Products } from "./components/models/Products";
import { Cart } from "./components/models/Cart";
import { Order } from "./components/models/Order";
import { Api } from "./components/base/Api";
import { Server } from "./components/base/Server";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

const api = new Api(API_URL);
const server = new Server(api);

const productsModel = new Products();
const cartModel = new Cart();
const orderModel = new Order();

const exampleIDProduct = "854cef69-976d-4c2a-a18c-2aa45046c390";
console.log("Testing Products model");
productsModel.setItems(apiProducts.items);
console.log("All Products:", productsModel.getItems());
console.log(
  "Product with ID '854cef69-976d-4c2a-a18c-2aa45046c390':",
  productsModel.getProductById(exampleIDProduct),
);

if (productsModel.getProductById(exampleIDProduct)) {
  productsModel.setSelectedProduct(
    productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")!,
  );
  console.log("Selected Product:", productsModel.getSelectedProduct());
}

console.log("Testing Cart model");
cartModel.addProduct(apiProducts.items[0]);
cartModel.addProduct(apiProducts.items[1]);
console.log("Cart Products after adding 2 items:", cartModel.getProducts());
console.log(
  "Is product with ID '854cef69-976d-4c2a-a18c-2aa45046c390' in cart?",
  cartModel.isProductInCart(exampleIDProduct),
);
console.log("Total Price:", cartModel.getTotalPrice());
console.log("Item Count:", cartModel.getItemCount());
cartModel.removeProduct(exampleIDProduct);
console.log(
  "Cart Products after removing product with ID '854cef69-976d-4c2a-a18c-2aa45046c390':",
  cartModel.getProducts(),
);
cartModel.clearCart();
console.log("Cart Products after clearing cart:", cartModel.getProducts());

console.log("Testing Order model");
orderModel.setOrderData({
  payment: "card",
  email: "",
  phone: "+1234567890",
  address: "123 Main St",
});
console.log("Order Data:", orderModel.getOrderData());
console.log("Validation Errors:", orderModel.validateOrderData());
orderModel.clearOrderData();
console.log("Order Data after clearing:", orderModel.getOrderData());

console.log("Testing Server model");

server
  .getProducts()
  .then((productsFromServer) => {
    console.log("✅");
    console.log("Count products:", productsFromServer.length);
    console.log("Products:", productsFromServer);

    // сохраняем полученные с сервера товары в Products
    productsModel.setItems(productsFromServer);

    console.log("Products from model:", productsModel.getItems());
  })
  .catch((error) =>
    console.error(`Error fetching products from server: ${error}`),
  );

console.log("Finally! :D");
