import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCarById } from "@/lib/pocketbase";
import { CarDetail } from "@/components/car-detail";
import { CarDetailSkeleton } from "@/components/skeleton/car-detail-skeleton";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    return {
      title: "Car Not Found",
      description: "The requested car details could not be found.",
    };
  }

  return {
    title: `${car.expand?.model.expand?.brand.name} ${car.expand?.model.name}`,
    description: `View details for ${car.year} ${car.expand?.model.expand?.brand.name} ${car.expand?.model.name}`,
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<CarDetailSkeleton />}>
        <CarDetail data={car} />
      </Suspense>
    </main>
  );
}
