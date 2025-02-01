import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CarDetail } from "@/components/car-detail";
import { CarDetailSkeleton } from "@/components/skeleton/car-detail-skeleton";
import { getCarById } from "@/lib/pocketbase";

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const car = await getCarById(resolvedParams.id);

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
