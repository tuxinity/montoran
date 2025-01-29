export interface Car {
  id: string;
  category: CarCategory;
  name: string;
  image: string;
  transmission: TransmissionType;
  seats: number;
  bags: number;
  rating: number;
  price: number;
}

export type CarCategory = "Hatchback" | "Minivan" | "SUV" | "Sedan" | "MPV";
export type TransmissionType = "Automatic" | "Manual" | "Automatic/Manual";
