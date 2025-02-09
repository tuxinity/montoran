interface BodyType {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Model {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  brand?: string;
  body_type: string | BodyType;
  seats: number;
  cc: number;
  bags: number;
  expand?: {
    body_type: BodyType;
    brand: Brand;
  };
}

export interface Car {
  id: string;
  collectionId: string;
  collectionName: string;
  buy_price: number;
  sell_price: number;
  condition: number;
  mileage: number;
  transmission: string;
  description: string;
  year: number;
  images: string[];
  created: string;
  updated: string;
  model: string | Model;
  expand?: {
    model: Model & {
      expand?: {
        body_type: BodyType;
      };
    };
  };
}
