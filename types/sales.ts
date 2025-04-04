export type Sale = {
  id: string;
  date: string;
  customerName: string;
  carName: string;
  price: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
};
