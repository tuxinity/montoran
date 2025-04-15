"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CarApi from "@/lib/car-api";
import { Sale } from "@/types/sales";
import { Car } from "@/types/car";
import { pb } from "@/lib/pocketbase";
import AuthApi from "@/lib/auth-api";

interface NewSaleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Sale, "id">) => void;
}

export const NewSaleDialog = ({
  open,
  onClose,
  onSubmit,
}: NewSaleDialogProps) => {
  const [customerName, setCustomerName] = useState("");
  const [carId, setCarId] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCars();
    }
  }, [open]);

  const loadCars = async () => {
    setLoading(true);
    try {
      const carsData = await CarApi.getCars({
        filters: {
          soldStatus: "available",
        },
      });
      setCars(carsData);
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCarSelect = (carId: string) => {
    setCarId(carId);
    const selectedCar = cars.find((car) => car.id === carId);
    if (selectedCar) {
      setPrice(selectedCar.sell_price.toString());
    }
  };

  const handleSubmit = () => {
    if (!customerName || !carId || !price) {
      alert("Please fill all required fields");
      return;
    }

    if (!AuthApi.isLoggedIn()) {
      alert("User not authenticated");
      return;
    }

    const currentUser = AuthApi.getPocketBase().authStore.model?.id;
    if (!currentUser) {
      alert("Failed to get user information");
      return;
    }

    const saleData: Omit<Sale, "id"> = {
      customer_name: customerName,
      car: carId,
      price: parseFloat(price),
      payment_method: paymentMethod,
      notes: notes || undefined,
      created_by: currentUser,
    };

    onSubmit(saleData);
    resetForm();
  };

  const resetForm = () => {
    setCustomerName("");
    setCarId("");
    setPrice("");
    setPaymentMethod("Cash");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
          <DialogDescription>
            Add a new sale record to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">
              Customer
            </Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="col-span-3"
              placeholder="Customer name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="car" className="text-right">
              Car
            </Label>
            <Select value={carId} onValueChange={handleCarSelect}>
              <SelectTrigger className="col-span-3" id="car">
                <SelectValue placeholder="Select a car" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading cars...
                  </SelectItem>
                ) : cars.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No cars available
                  </SelectItem>
                ) : (
                  cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.expand?.model.expand?.brand.name}{" "}
                      {car.expand?.model.name} - {car.year} -{" "}
                      {car.expand?.model.expand?.body_type.name} - IDR{" "}
                      {car.sell_price.toLocaleString()}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
              placeholder="Sale price"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment" className="text-right">
              Payment
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="col-span-3" id="payment">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes about this sale"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
