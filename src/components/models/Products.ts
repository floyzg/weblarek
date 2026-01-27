import { IProduct } from "../../types";

export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems():  IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | null {
    return this.items.find((item) => item.id === id) || null;
  }

  setSelectedProduct(item: IProduct): void {
    this.selectedItem = item;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedItem;
  }
}