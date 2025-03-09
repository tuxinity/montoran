import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CarApi from "@/lib/car-api";
import { CarDetail } from "@/components/car-detail";
import { CarDetailSkeleton } from "@/components/skeleton/car-detail-skeleton";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const car = await CarApi.getCarById({ id });

  if (!car) {
    return {
      title: "Car Not Found | Montoran",
      description: "The requested car details could not be found.",
    };
  }

  const brand = car.expand?.model.expand?.brand.name;
  const model = car.expand?.model.name;
  const year = car.year;
  const imageUrl = car.images?.[0]
    ? CarApi.getImageUrl(car, car.images[0])
    : null;

  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  if (brand) ogUrl.searchParams.set("brand", brand);
  if (model) ogUrl.searchParams.set("model", model);
  if (year) ogUrl.searchParams.set("year", year.toString());
  if (imageUrl) {
    ogUrl.searchParams.set("image", imageUrl);
  }

  console.log("OG URL:", ogUrl.toString());

  return {
    title: `${year} ${brand} ${model} | Montoran`,
    description: `View details for ${year} ${brand} ${model}. Explore specifications, features, and pricing.`,
    openGraph: {
      title: `${year} ${brand} ${model}`,
      description: `View details for ${year} ${brand} ${model}. Explore specifications, features, and pricing.`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${year} ${brand} ${model}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${year} ${brand} ${model}`,
      description: `View details for ${year} ${brand} ${model}. Explore specifications, features, and pricing.`,
      images: [ogUrl.toString()],
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const car = await CarApi.getCarById({ id });

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
