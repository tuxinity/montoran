"use client";

import { useEffect, useState, useRef } from "react";
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

export function CarList({ className = "", initialCars }: CarListProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCars = async (query?: string, filters?: FilterValues) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    try {
      const results = await CarApi.getCars({ search: query, filters });
      setCars(results);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    fetchCars(query);
  };

  const handleFilterChange = async (filters: FilterValues) => {
    fetchCars("", filters);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <CarFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {loading ? (
        <CarListSkeleton />
      ) : cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cars found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
