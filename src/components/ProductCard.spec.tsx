import React from "react";
import { render } from "@testing-library/react";
import ProductCard from "@/src/components/ProductCard";
import { ItemType } from "@/types";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/src/contexts/CartContext", () => ({
  useCart: () => ({
    cart: [],
    addToCart: jest.fn(),
    updateQuantity: jest.fn(),
    removeFromCart: jest.fn(),
  }),
}));

const sampleProduct: ItemType = {
  id: "1",
  name: "Grapes",
  price: 100,
  discount: 10,
  quantity: 20,
  image: "/grapes.jpg",
  description: "Fresh Grapes from Nashik.",
  createdAt: "2025-05-01T00:00:00Z",
  category: "fruits",
  isSeasonal: true,
};

describe("ProductCard Snapshot", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<ProductCard product={sampleProduct} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
