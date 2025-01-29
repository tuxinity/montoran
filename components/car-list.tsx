"use client";

import { cars } from "@/constant/dummy-cars";
import type { Car } from "@/types/car";
import { CarCard } from "./card";

interface CarListProps {
  onSelectCar?: (car: Car) => void;
  className?: string;
}

export function CarList({ onSelectCar, className = "" }: CarListProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {cars.map((car) => (
        <CarCard key={car.id} car={car} onSelect={onSelectCar} />
      ))}
    </div>
  );
}
