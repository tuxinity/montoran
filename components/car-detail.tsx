"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Car } from "@/types/car";
import { ImageGallery } from "./ui/image-gallery";
import { idrFormat } from "@/utils/idr-format";
import { Calendar, Users, Briefcase, Gauge, ArrowUp } from "lucide-react";
import { getImageUrl } from "@/lib/pocketbase";

// const SpecificationGrid = ({ specs }: { specs: Car["specs"] }) => (
//   <div className="grid grid-cols-3 gap-4">
//     {Object.entries(specs).map(([key, value]) => (
//       <div key={key}>
//         <p className="text-sm text-muted-foreground">
//           {key.charAt(0).toUpperCase() + key.slice(1)}
//         </p>
//         <p className="font-medium">koplek</p>
//       </div>
//     ))}
//   </div>
// );

interface CarDetailProps {
  data: Car;
}

export function CarDetail({ data }: CarDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  // const [selectedColor, setSelectedColor] = useState(0);

  const specs = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: "Year",
      value: data.year,
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Seats",
      value: data.expand?.model?.seats || "N/A",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: "Bags",
      value: `${data.expand?.model?.bags}`,
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      label: "Transmission",
      value: data.transmission,
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Car Viewer */}
        <div className="lg:sticky lg:top-6 space-y-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowUp className="w-4 h-4 mr-2 rotate-[270deg]" />
              Back to Listings
            </Button>
          </Link>

          <ImageGallery
            images={data.images.map((image) => getImageUrl(data, image))}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            name={data.expand?.model.name ?? "vehicle"}
          />
        </div>

        {/* Right Column - Configuration */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {data.expand?.model.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground uppercase">
                {data.expand?.model.expand?.brand.name}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground capitalize">
                {data.expand?.model?.expand?.body_type?.name}
              </span>
            </div>
            <p className="text-muted-foreground mt-2">
              Starting at {idrFormat(data.sell_price)} MSRP
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specs.map((spec, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg p-4 text-center space-y-2"
              >
                <div className="mx-auto w-8 h-8 text-muted-foreground">
                  {spec.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{spec.label}</p>
                  <p className="font-medium">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">About This Car</h2>
            <p className="text-muted-foreground">
              Experience luxury and performance with our latest model. This car
              combines cutting-edge technology with elegant design, offering a
              smooth ride and impressive features that cater to both comfort and
              style
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium">Key Features</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                  <li>Advanced driver assistance systems</li>
                  <li>Premium interior materials</li>
                  <li>State-of-the-art infotainment system</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Performance</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                  <li>Powerful engine options</li>
                  <li>Smooth and responsive handling</li>
                  <li>Excellent fuel efficiency</li>
                </ul>
              </div>
            </div>
          </section>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                <p className="font-medium">March 2025</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold">
                  {idrFormat(data.sell_price)}
                </p>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Place Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
