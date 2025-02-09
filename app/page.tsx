import { CarList } from "@/components/car-list";
import { getCars } from "@/lib/pocketbase";

export default async function Home() {
  const initialCars = await getCars();

  return (
    <main className="container mx-auto py-6 px-4 md:py-8 md:px-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Available Cars</h1>
          <p className="text-muted-foreground">
            Choose from our selection of quality vehicles for your journey
          </p>
        </div>
        <CarList initialCars={initialCars} className="pb-8" />
      </div>
    </main>
  );
}
