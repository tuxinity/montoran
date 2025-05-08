import { Suspense } from "react";
import { HomeClient } from "./home-client";
import CarApi from "@/lib/car-api";

export const revalidate = 10;

const Home = async () => {
  // Fetch cars on the server
  const initialCars = await CarApi.getCars({});

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient initialCars={initialCars} />
    </Suspense>
  );
};

export default Home;
