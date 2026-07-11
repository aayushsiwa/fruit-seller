export interface IProduct {
  ID: string;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  category: string;
  discount: number;
  isSeasonal: boolean;
  createdAt: string;
}

export class Product implements IProduct {
  ID: string;
  name: string;
  slug?: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  category: string;
  discount: number;
  isSeasonal: boolean;
  createdAt: string;

  constructor(
    data:
      | IProduct
      | (Omit<IProduct, 'stock'> & { stock?: number; images?: string[] | string })
  ) {
    this.ID = data.ID;
    this.name = data.name;
    this.slug = data.slug;
    this.price = data.price;
    this.stock =
      'stock' in data && data.stock != null
        ? data.stock
        : 0;
    this.images = Array.isArray(data.images) ? data.images : data.images ? [data.images] : [];
    this.description = data.description;
    this.category = data.category;
    this.discount = data.discount;
    this.isSeasonal = data.isSeasonal;
    this.createdAt = data.createdAt;
  }
}
