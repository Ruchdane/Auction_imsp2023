export interface Product {
  src: string;
  name: string;
  count: number;
  price: 10;
}
const data: any[] = Array.from(Array(100), (_) => ({
  src: "https://picsum.photos/200/200?grayscale&blur=2",
  name: "My Product",
  count: 2,
  price: 10,
}));

export function getAllProduct(): Product[] {
  return data;
}

export function getProduct(_productId: number | undefined): Product {
  return data[0];
}
