export enum StatusItem {
  AVAILABLE = "available",
  SOLD = "sold",
  AUCTION = "inAuction",
}

export type Item = {
  id: string;
  name: string;
  stockId: string;
  quantity: number;
  imgUrl: string;
  category: string;
  description: string;
  initial_price: number;
  sold_price: number;
  status: StatusItem;
};
