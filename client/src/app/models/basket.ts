export interface BasketItem {
  productId: number;
  name?: any;
  price: number;
  pictureUrl?: any;
  brand?: any;
  type?: any;
  quantity: number;
}

export interface Basket {
  id: number;
  buyerId: string;
  items: BasketItem[];
}
