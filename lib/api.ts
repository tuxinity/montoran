import { cars } from "@/constant/dummy-cars";
import type { Car } from "@/types/car";
import type { CarDetailData } from "@/types/car-detail";

export async function getCars(): Promise<Car[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(cars), 500);
  });
}

export async function getCarById(id: string): Promise<CarDetailData | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const car = cars.find((car) => car.id === id);
      if (!car) {
        resolve(null);
        return;
      }

      const carDetailData: CarDetailData = {
        id: car.id,
        name: car.name,
        basePrice: car.price * 1000, // Converting daily rate to MSRP for example
        specs: {
          range: "Up to 350 mi",
          acceleration: "Up to 4.5 sec",
          horsepower: "Up to 517hp",
        },
        config: {
          trims: [
            { name: "Standard", price: car.price * 1000 },
            { name: "Premium", price: car.price * 1200 },
          ],
          packages: [
            { name: "Standard Pack", price: "Included" },
            { name: "Performance Pack", price: 6000 },
          ],
          colors: [
            { name: "Magnesium", price: "Included", hex: "#E2E2E2" },
            { name: "Snow", price: 1600, hex: "#FFFFFF" },
            { name: "Thunder", price: 1300, hex: "#4A4A4A" },
            { name: "Jupiter", price: 1300, hex: "#B8B8B8" },
            { name: "Midnight", price: 1300, hex: "#1A1A1A" },
            { name: "Space", price: 1300, hex: "#2A2A2A" },
          ],
          upgrades: [{ name: "Pilot Pack", price: "Included" }],
        },
        images: [
          car.image,
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
      };
      resolve(carDetailData);
    }, 500);
  });
}
