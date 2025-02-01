import { getCars } from "@/lib/pocketbase";
import { CarCard } from "./card";

interface CarListProps {
  className?: string;
}

export async function CarList({ className = "" }: CarListProps) {
  const cars = await getCars();
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
