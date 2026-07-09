import { describe, expect, it } from 'vitest';

import { IProduct, Product } from './Products';

const mockProductData: IProduct = {
  id: 'prod-1',
  name: 'Mango',
  price: 120,
  stock: 50,
  image: 'https://example.com/mango.jpg',
  description: 'Fresh Alphonso mangoes',
  category: 'Tropical',
  discount: 10,
  isSeasonal: true,
  createdAt: '2024-01-15T10:00:00.000Z',
};

describe('Product entity', () => {
  it('creates an instance of Product', () => {
    const product = new Product(mockProductData);
    expect(product).toBeInstanceOf(Product);
  });

  it('maps all IProduct fields correctly', () => {
    const product = new Product(mockProductData);

    expect(product.id).toBe('prod-1');
    expect(product.name).toBe('Mango');
    expect(product.price).toBe(120);
    expect(product.stock).toBe(50);
    expect(product.image).toBe('https://example.com/mango.jpg');
    expect(product.description).toBe('Fresh Alphonso mangoes');
    expect(product.category).toBe('Tropical');
    expect(product.discount).toBe(10);
    expect(product.isSeasonal).toBe(true);
    expect(product.createdAt).toBe('2024-01-15T10:00:00.000Z');
  });

  it('preserves falsy-but-valid field values', () => {
    const data: IProduct = {
      ...mockProductData,
      discount: 0,
      isSeasonal: false,
      stock: 0,
    };
    const product = new Product(data);

    expect(product.discount).toBe(0);
    expect(product.isSeasonal).toBe(false);
    expect(product.stock).toBe(0);
  });
});
