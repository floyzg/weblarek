import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    if (product.price === null) {
      return;
    }
    if (!this.items.find((item) => item.id === product.id)) {
      this.items.push(product);
    }
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  clearCart(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  isProductInCart(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}