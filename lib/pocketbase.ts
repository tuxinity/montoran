import PocketBase from "pocketbase";
import type { Car } from "@/types/car";
import type { FilterValues } from "@/components/car-filters";
import { ClientResponseError } from "pocketbase";

export const pb = new PocketBase("https://montoran.inklusif.id");

export const getCars = async (
  search?: string,
  filters?: FilterValues,
  signal?: AbortSignal
): Promise<Car[]> => {
  try {
    const filterRules = [];

    if (search) {
      filterRules.push(
        `(model.name ~ "${search}" || model.brand.name ~ "${search}")`
      );
    }

    if (filters?.brand && filters.brand !== "all") {
      filterRules.push(`model.brand.id = "${filters.brand}"`);
    }
    if (filters?.bodyType && filters.bodyType !== "all") {
      filterRules.push(`model.body_type.id = "${filters.bodyType}"`);
    }
    if (filters?.transmission && filters.transmission !== "all") {
      filterRules.push(`transmission = "${filters.transmission}"`);
    }
    if (filters?.minPrice && filters.minPrice.toString() !== "all") {
      filterRules.push(`sell_price >= ${filters.minPrice}`);
    }

    const records = await pb.collection("cars").getFullList<Car>({
      sort: "-created",
      expand: "model.body_type,model.brand",
      filter: filterRules.length > 0 ? filterRules.join(" && ") : undefined,
      $autoCancel: false,
      $cancelKey: "cars",
      signal,
    });

    return records;
  } catch (error) {
    if (error instanceof ClientResponseError && error.isAbort) {
      console.log("Request was cancelled");
      return [];
    }
    console.error("Error fetching cars:", error);
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
