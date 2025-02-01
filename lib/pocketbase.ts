import PocketBase from "pocketbase";
import type { Car } from "@/types/car";

const pb = new PocketBase("https://montoran.inklusif.id");

export const getCars = async (): Promise<Car[]> => {
  try {
    const records = await pb.collection("cars").getFullList<Car>({
      sort: "-created",
      expand: "model.body_type",
    });
    return records;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw new Error("Failed to fetch cars");
  }
};

export const getCarById = async (id: string): Promise<Car> => {
  try {
    const record = await pb.collection("cars").getOne<Car>(id, {
      expand: "model.body_type,model.brand",
    });
    return record;
  } catch (error) {
    console.error("Error fetching car:", error);
    throw new Error("Failed to fetch car");
  }
};

export function getImageUrl(record: Car, filename: string): string {
  return pb.files.getURL(record, filename);
}
