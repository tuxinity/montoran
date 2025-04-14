import { CarList } from "@/components/car-list";
import CarApi from "@/lib/car-api";
import { Suspense } from "react";

export const revalidate = 10;

const Car = async () => {
  const initialCars = await CarApi.getCars({});
  return (
    <main className="container mx-auto py-6 px-4 md:py-8 md:px-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Available Cars</h1>
          <p className="text-muted-foreground">
            Choose from our selection of quality vehicles for your journey
          </p>
        </div>
        <Suspense fallback={<div>Loading cars...</div>}>
          <CarList initialCars={initialCars} className="pb-8" />
        </Suspense>
      </div>
    </main>
  );
};
export default Car;
