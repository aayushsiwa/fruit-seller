export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  category: string;
  discount: number;
  isSeasonal: boolean;
  createdAt: string;
}

export class Product implements IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  category: string;
  discount: number;
  isSeasonal: boolean;
  createdAt: string;

  constructor(
    data:
      | IProduct
      | (Omit<IProduct, 'stock'> & { quantity?: number; stock?: number })
  ) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.stock =
      'stock' in data && data.stock != null
        ? data.stock
        : 'quantity' in data && data.quantity != null
          ? data.quantity
          : 0;
    this.image = data.image;
    this.description = data.description;
    this.category = data.category;
    this.discount = data.discount;
    this.isSeasonal = data.isSeasonal;
    this.createdAt = data.createdAt;
  }
}
