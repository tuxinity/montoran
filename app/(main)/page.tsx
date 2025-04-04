import { CarList } from "@/components/car-list";
import CarApi from "@/lib/car-api";
import { Suspense } from "react";
import { Search, Car, Shield, Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 10;

export default async function Home() {
  const initialCars = await CarApi.getCars({});

  return (
    <main>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        {/* Floating cars */}
        <div className="absolute top-1/4 left-10 w-32 h-32 opacity-20 animate-float">
          <Image src="/camry.webp" alt="Car" fill className="object-contain" />
        </div>
        <div className="absolute top-1/3 right-10 w-32 h-32 opacity-20 animate-float-delayed">
          <Image src="/yaris.webp" alt="Car" fill className="object-contain" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>100% Mobil Bekas Berkualitas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Mobil Bekas Berkualitas dengan Harga Terbaik
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Temukan mobil bekas impian Anda dari berbagai merek dan tipe. 
              Dari MPV keluarga, SUV petualangan, hingga mobil sport performa tinggi. 
              Semua mobil kami telah melalui pemeriksaan ketat untuk memastikan kualitas terbaik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/car"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                Lihat Semua Mobil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Garansi Kualitas</h3>
              <p className="text-muted-foreground">
                Semua mobil telah melalui pemeriksaan menyeluruh oleh tim ahli kami
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transaksi Aman</h3>
              <p className="text-muted-foreground">
                Proses transaksi yang aman dan terpercaya dengan dukungan penuh
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Berbagai Pilihan</h3>
              <p className="text-muted-foreground">
                Koleksi mobil bekas berkualitas dari berbagai merek dan tipe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Koleksi Mobil Bekas Pilihan</h2>
            <p className="text-muted-foreground">
              Pilih dari koleksi mobil bekas berkualitas kami yang telah melalui proses inspeksi menyeluruh
            </p>
          </div>
          <Suspense fallback={<div>Loading cars...</div>}>
            <CarList initialCars={initialCars} className="pb-8" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
