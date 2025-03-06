import { Car, Model, Brand, BodyType, FilterValues } from "@/types/car";

// GET operations interfaces
export interface GetCarsOptions {
  search?: string;
  filters?: FilterValues;
}

export interface GetCarByIdOptions {
  id: string;
}

export interface GetModelsOptions {
  sort?: string;
  filter?: string;
}

export interface GetBrandsOptions {
  sort?: string;
  filter?: string;
}

export interface GetBodyTypesOptions {
  sort?: string;
  filter?: string;
}

// CREATE operations interfaces
export interface CreateCarRequest {
  model: string;
  body_type?: string;
  condition: number;
  transmission: "Automatic" | "Manual";
  mileage: number;
  buy_price: number;
  sell_price: number;
  year: number;
  description: string;
  images?: File[];
}

export interface CreateModelRequest {
  name: string;
  brand: string;
  body_type: string;
  seats?: number;
  cc?: number;
  bags?: number;
}

export interface CreateBrandRequest {
  name: string;
}

export interface CreateBodyTypeRequest {
  name: string;
}

// UPDATE operations interfaces
export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  id: string;
}

export interface UpdateModelRequest extends Partial<CreateModelRequest> {
  id: string;
}

export interface UpdateBrandRequest extends Partial<CreateBrandRequest> {
  id: string;
}

export interface UpdateBodyTypeRequest extends Partial<CreateBodyTypeRequest> {
  id: string;
}

// DELETE operations interfaces
export interface DeleteCarOptions {
  id: string;
}

export interface DeleteModelOptions {
  id: string;
}

export interface DeleteBrandOptions {
  id: string;
}

export interface DeleteBodyTypeOptions {
  id: string;
}

// API function signatures
export interface ICarAPI {
  // GET functions
  getCars: (options?: GetCarsOptions) => Promise<Car[]>;
  getCarById: (options: GetCarByIdOptions) => Promise<Car>;
  getModels: (options?: GetModelsOptions) => Promise<Model[]>;
  getBrands: (options?: GetBrandsOptions) => Promise<Brand[]>;
  getBodyTypes: (options?: GetBodyTypesOptions) => Promise<BodyType[]>;

  // CREATE functions
  createCar: (data: FormData | CreateCarRequest) => Promise<Car>;
  createModel: (data: CreateModelRequest) => Promise<Model>;
  createBrand: (data: CreateBrandRequest) => Promise<Brand>;
  createBodyType: (data: CreateBodyTypeRequest) => Promise<BodyType>;

  // UPDATE functions
  updateCar: (
    id: string,
    data: FormData | Partial<CreateCarRequest>
  ) => Promise<Car>;
  updateModel: (
    id: string,
    data: Partial<CreateModelRequest>
  ) => Promise<Model>;
  updateBrand: (
    id: string,
    data: Partial<CreateBrandRequest>
  ) => Promise<Brand>;
  updateBodyType: (
    id: string,
    data: Partial<CreateBodyTypeRequest>
  ) => Promise<BodyType>;

  // DELETE functions
  deleteCar: (id: string) => Promise<boolean>;
  deleteModel: (id: string) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<boolean>;
  deleteBodyType: (id: string) => Promise<boolean>;

  // UTILITY functions
  getImageUrl: (record: Car, filename: string) => string;
  isLoggedIn: () => boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    token: string;
    user: {
      id: string;
      email: string;
    };
  }>;
  logout: () => void;
}

export interface IAuthAPI {
  isLoggedIn: () => boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    token: string;
    user: {
      id: string;
      email: string;
    };
  }>;
  logout: () => void;
}
