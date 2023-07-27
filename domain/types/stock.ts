import { Item } from "./items";

export type Stock = {
  id: string;
  ownerId: string;
  items: Item[];
};
