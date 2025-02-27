// Base PocketBase record interface
export interface PocketBaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
}

// BodyType collection
export interface BodyType
  extends Omit<PocketBaseRecord, "created" | "updated"> {
  name: string;
}

// Brand collection
export interface Brand
  extends Omit<
    PocketBaseRecord,
    "collectionId" | "collectionName" | "created" | "updated"
  > {
  name: string;
}

// Model collection
export interface Model extends Omit<PocketBaseRecord, "created" | "updated"> {
  name: string;
  brand: string;
  body_type: string;
  seats: number;
  cc: number;
  bags: number;
  expand?: {
    body_type: BodyType;
    brand: Brand;
  };
}

// Car collection
export interface Car extends PocketBaseRecord {
  model: string;
  body_type?: string;
  condition: number;
  transmission: "Automatic" | "Manual";
  mileage: number;
  buy_price: number;
  sell_price: number;
  year: number;
  description: string;
  images: string[];
  expand?: {
    model: Model & {
      expand?: {
        body_type: BodyType;
        brand: Brand;
      };
    };
  };
}

// User collection
export interface User extends PocketBaseRecord {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
  name?: string;
}

// Authentication response
export interface AuthResponse {
  token: string;
  user: User;
}

// Filter types for API queries
export interface FilterValues {
  brand?: string;
  bodyType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Create/Update request types
export interface CreateCarRequest {
  model: string;
  condition: number;
  transmission: "Automatic" | "Manual";
  mileage: number;
  buy_price: number;
  sell_price: number;
  year: number;
  description: string;
}

export interface CreateModelRequest {
  name: string;
  brand: string;
  body_type: string;
  seats: number;
  cc: number;
  bags: number;
}

export interface CarFormData {
  model: string;
  year: number | null;
  condition: number | null;
  mileage: number | null;
  buy_price: number | null;
  sell_price: number | null;
  transmission: string | null;
  description: string | null;
  images?: File[] | FormDataEntryValue[];
}

// Type for fully expanded models
export type ModelWithExpand = Model & Required<Pick<Model, "expand">>;

// Types for handling cars with expanded records
export type CarWithExpand = Car & Required<Pick<Car, "expand">>;
export type CarWithFullExpand = Car & {
  expand: {
    model: Model & {
      expand: {
        body_type: BodyType;
        brand: Brand;
      };
    };
  };
};

// PocketBase query parameters
export interface PocketBaseQueryParams {
  filter?: string;
  sort?: string;
  expand?: string;
  fields?: string;
  skipTotal?: boolean;
  page?: number;
  perPage?: number;
  $autoCancel?: boolean;
  $cancelKey?: string;
}
