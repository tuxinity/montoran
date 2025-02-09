import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, GaugeCircle } from "lucide-react";
import type { Car } from "@/types/car";
import { getImageUrl } from "@/lib/pocketbase";
import { idrFormat } from "@/utils/idr-format";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/car/${car.id}`}>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg cursor-pointer">
        <CardHeader className="p-0 space-y-0 relative">
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 z-10 bg-white/90 text-black hover:bg-white uppercase text-xs"
          >
            {car.expand?.model.expand?.body_type.name}
          </Badge>
          {car.images && car.images.length > 0 && (
            <div className="overflow-hidden">
              <Image
                src={getImageUrl(car, car.images[0])}
                alt={`${car.expand?.model.expand?.body_type.name} vehicle`}
                width={512}
                height={384}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-lg tracking-tight capitalize">
            {car.expand?.model.name}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <GaugeCircle className="w-4 h-4" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{car.expand?.model.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>{car.expand?.model.bags} bags</span>
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <p className="text-sm text-muted-foreground">Start from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {idrFormat(car.sell_price)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
