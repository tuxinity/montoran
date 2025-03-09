"use client";

import { useEffect, useState, useCallback } from "react";
import CarApi from "@/lib/car-api";
import { CarCard } from "./card";
import type { Car } from "@/types/car";
import type { FilterValues } from "@/components/car-filters";
import { CarFilters } from "@/components/car-filters";
import { CarListSkeleton } from "./skeleton/car-list-skeleton";

interface CarListProps {
  className?: string;
  initialCars: Car[];
}

export function CarList({ initialCars, className }: CarListProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [search, setSearch] = useState<string>("");

  const loadCars = useCallback(
    async (searchValue: string, filterValues: FilterValues) => {
      setIsLoading(true);
      try {
        const updatedCars = await CarApi.getCars({
          search: searchValue.trim(),
          filters: filterValues,
        });
        setCars(updatedCars);
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      loadCars(value, filters);
    },
    [filters, loadCars]
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterValues) => {
      setFilters(newFilters);
      loadCars(search, newFilters);
    },
    [search, loadCars]
  );

  useEffect(() => {
    const pb = CarApi.getPocketBase();
    let unsubscribe: (() => void) | undefined;

    pb?.collection("cars")
      .subscribe("*", async () => {
        loadCars(search, filters);
      })
      .then((sub) => {
        unsubscribe = sub;
      });

    return () => {
      unsubscribe?.();
    };
  }, [search, filters, loadCars]);

  return (
    <div className={className}>
      <CarFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {isLoading ? (
          <CarListSkeleton />
        ) : (
          cars.map((car) => <CarCard key={car.id} car={car} />)
        )}
      </div>
    </div>
  );
}
