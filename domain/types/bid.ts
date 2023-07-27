import { User } from "./user";

export type Bid = {
  id: string;
  auctionId: string;
  bidderId: string;
  bidder: User;
  amount: number;
  updatedDate: any;
};
