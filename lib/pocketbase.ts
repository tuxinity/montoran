import Cookies from "js-cookie";
import PocketBase from "pocketbase";
import type { Car, Model } from "@/types/car";
import { ClientResponseError } from "pocketbase";
import type { FilterValues } from "@/components/car-filters";

const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (!pocketbaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_POCKETBASE_URL is not defined in environment variables"
  );
}

export const pb = new PocketBase(pocketbaseUrl);

export const getCars = async (
  search?: string,
  filters?: FilterValues
): Promise<Car[]> => {
  try {
    const filterRules = [];

    if (search) {
      filterRules.push(`model.name ~ "${search}"`);
    }

    if (filters?.brand) {
      filterRules.push(`model.brand = "${filters.brand}"`);
    }

    if (filters?.bodyType) {
      filterRules.push(`model.body_type = "${filters.bodyType}"`);
    }

    if (filters?.transmission) {
      filterRules.push(`transmission = "${filters.transmission}"`);
    }

    if (filters?.minPrice) {
      filterRules.push(`sell_price >= ${filters.minPrice}`);
    }

    if (filters?.maxPrice) {
      filterRules.push(`sell_price <= ${filters.maxPrice}`);
    }

    const records = await pb.collection("cars").getFullList<Car>({
      sort: "-created",
      expand: "model.brand,model.body_type",
      filter: filterRules.length > 0 ? filterRules.join(" && ") : undefined,
      $autoCancel: false,
    });

    return records;
  } catch (error) {
    if (error instanceof Error) {
      console.error("PocketBase filter error:", error.message);
    }
    throw error;
  }
};

export const getCarById = async (id: string): Promise<Car> => {
  try {
    const record = await pb.collection("cars").getOne<Car>(id, {
      expand: "model.body_type,model.brand",
      $autoCancel: false,
      $cancelKey: `car-${id}`,
    });

    if (!record) {
      throw new Error(`Car with ID ${id} not found`);
    }

    return record;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      if (error.status === 404) {
        throw new Error(`Car with ID ${id} not found`);
      }
      throw new Error(`Failed to fetch car: ${error.message}`);
    }

    console.error("Error fetching car:", error);
    throw new Error("An unexpected error occurred while fetching the car");
  }
};

export function getImageUrl(record: Car, filename: string): string {
  return pb.files.getURL(record, filename);
}

export const login = async (email: string, password: string) => {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    Cookies.set("pb_auth", pb.authStore.token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return authData;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  pb.authStore.clear();
  Cookies.remove("pb_auth");
};

export const isLoggedIn = () => {
  return pb.authStore.isValid;
};

interface CarFormData {
  model: string;
  year: FormDataEntryValue | null;
  condition: FormDataEntryValue | null;
  mileage: FormDataEntryValue | null;
  buy_price: FormDataEntryValue | null;
  sell_price: FormDataEntryValue | null;
  transmission: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  images?: FormDataEntryValue[];
}

export const createCar = async (formData: FormData) => {
  try {
    const brandId = formData.get("brand") as string;
    const bodyTypeId = formData.get("body_type") as string;
    let brand = await pb
      .collection("brand")
      .getFirstListItem(`name = "${formData.get("brand")}"`)
      .catch(() => null);
    if (!brand) {
      brand = await pb.collection("brand").create({
        name: formData.get("brand"),
      });
    }

    let bodyType = await pb
      .collection("body_type")
      .getFirstListItem(`name = "${formData.get("body_type")}"`)
      .catch(() => null);
    if (!bodyType) {
      bodyType = await pb.collection("body_type").create({
        name: formData.get("body_type"),
      });
    }

    let model = await pb
      .collection("model")
      .getFirstListItem(`name = "${formData.get("model")}"`)
      .catch(() => null);
    if (!model) {
      model = await pb.collection("model").create({
        name: formData.get("model"),
        brand: brandId,
        body_type: bodyTypeId,
      });
    }

    const carData = {
      model: model?.id,
      year: formData.get("year"),
      condition: formData.get("condition"),
      mileage: formData.get("mileage"),
      buy_price: formData.get("buy_price"),
      sell_price: formData.get("sell_price"),
      transmission: formData.get("transmission"),
      description: formData.get("description"),
    } as CarFormData;

    const newImages = formData.getAll("images");
    if (newImages.length > 0 && newImages[0] instanceof File) {
      carData.images = newImages;
    }

    return await pb.collection("cars").create(carData);
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
};

export const updateCar = async (id: string, formData: FormData) => {
  try {
    let brand = await pb
      .collection("brand")
      .getFirstListItem(`name = "${formData.get("brand")}"`)
      .catch(() => null);
    if (!brand) {
      brand = await pb.collection("brand").create({
        name: formData.get("brand"),
      });
    }

    const bodyTypeId = formData.get("body_type");
    const bodyType = await pb
      .collection("body_type")
      .getOne(bodyTypeId as string);

    let model = await pb
      .collection("model")
      .getFirstListItem(`name = "${formData.get("model")}"`)
      .catch(() => null);
    if (!model) {
      model = await pb.collection("model").create({
        name: formData.get("model"),
        brand: brand?.id,
        body_type: bodyType.id,
      });
    }

    const carData = {
      model: model?.id,
      year: formData.get("year"),
      condition: formData.get("condition"),
      mileage: formData.get("mileage"),
      buy_price: formData.get("buy_price"),
      sell_price: formData.get("sell_price"),
      transmission: formData.get("transmission"),
      description: formData.get("description"),
    } as CarFormData;

    const newImages = formData.getAll("images");
    if (newImages.length > 0 && newImages[0] instanceof File) {
      carData.images = newImages;
    }

    return await pb.collection("cars").update(id, carData);
  } catch (error) {
    throw error;
  }
};

export const deleteCar = async (id: string) => {
  try {
    await pb.collection("cars").delete(id);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getModels = async (): Promise<Model[]> => {
  try {
    const records = await pb.collection("models").getFullList<Model>({
      expand: "brand,body_type",
      sort: "name",
    });
    return records;
  } catch (error) {
    throw error;
  }
};
