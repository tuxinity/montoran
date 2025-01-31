"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CarDetailData } from "@/types/car-detail";
import { ImageGallery } from "./ui/image-gallery";

const SpecificationGrid = ({ specs }: { specs: CarDetailData["specs"] }) => (
  <div className="grid grid-cols-3 gap-4">
    {Object.entries(specs).map(([key, value]) => (
      <div key={key}>
        <p className="text-sm text-muted-foreground">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </p>
        <p className="font-medium">{value}</p>
      </div>
    ))}
  </div>
);

interface CarDetailProps {
  data: CarDetailData;
}

export function CarDetail({ data }: CarDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column - Car Viewer */}
        <div className="lg:sticky lg:top-6 space-y-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <svg
                viewBox="0 0 15 15"
                fill="none"
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 0.5L7.5 14.5M7.5 0.5L1.5 6.5M7.5 0.5L13.5 6.5"
                  stroke="currentColor"
                />
              </svg>
              Back to Listings
            </Button>
          </Link>

          <ImageGallery
            images={data.images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            name={data.name}
          />
        </div>

        {/* Right Column - Configuration */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <p className="text-muted-foreground">
              Starting at ${data.basePrice.toLocaleString()} MSRP
            </p>
          </div>

          <SpecificationGrid specs={data.specs} />

          <div className="space-y-6">
            {/* Car Description Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">About This Car</h2>
              <p className="text-muted-foreground">
                Experience luxury and performance with our latest model. This
                car combines cutting-edge technology with elegant design,
                offering a smooth ride and impressive features that cater to
                both comfort and style
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

            {/* Colors Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Exterior Color</h2>
              <div className="grid grid-cols-2 gap-4">
                {data.config.colors.map((color, index) => (
                  <Button
                    key={index}
                    variant={selectedColor === index ? "default" : "outline"}
                    onClick={() => setSelectedColor(index)}
                    className="h-auto py-4"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{color.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {typeof color.price === "number"
                            ? `+ $${color.price.toLocaleString()}`
                            : color.price}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </section>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                <p className="font-medium">March 2025</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold">$ 100</p>
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
