import { Car, User } from "./car";

export type Sale = {
  id: string;
  date: string;
  customerName: string;
  car: string;
  price: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
  notes?: string;
  salesPerson?: string;
  expand?: {
    car: Car;
    salesPerson?: User;
  };
};
