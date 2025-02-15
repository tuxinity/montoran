import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Car, BodyType } from "@/types/car";

// Add Brand type if not already defined in your types
interface Brand {
  id: string;
  name: string;
}

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  modalType: "create" | "edit";
  bodyTypes: BodyType[];
  brands: Brand[]; // Add brands prop
  selectedCar?: Car;
}

export function CarForm({
  open,
  onClose,
  onSubmit,
  loading,
  modalType,
  bodyTypes,
  brands, // Add brands to destructuring
  selectedCar,
}: CarFormProps) {
  const [initialValues, setInitialValues] = useState({
    brand: selectedCar?.expand?.model?.expand?.brand?.id || "", // Change to id instead of name
    model: selectedCar?.expand?.model?.name || "",
    body_type: selectedCar?.expand?.model?.expand?.body_type?.id || "",
    year: selectedCar?.year || "",
    condition: selectedCar?.condition || "",
    mileage: selectedCar?.mileage || "",
    buy_price: selectedCar?.buy_price || "",
    sell_price: selectedCar?.sell_price || "",
    transmission: selectedCar?.transmission || "",
    description: selectedCar?.description || "",
  });

  useEffect(() => {
    if (selectedCar) {
      setInitialValues({
        brand: selectedCar.expand?.model?.expand?.brand?.id || "", // Change to id
        model: selectedCar.expand?.model?.name || "",
        body_type: selectedCar.expand?.model?.expand?.body_type?.id || "",
        year: selectedCar.year || "",
        condition: selectedCar.condition || "",
        mileage: selectedCar.mileage || "",
        buy_price: selectedCar.buy_price || "",
        sell_price: selectedCar.sell_price || "",
        transmission: selectedCar.transmission || "",
        description: selectedCar.description || "",
      });
    } else {
      setInitialValues({
        brand: "",
        model: "",
        body_type: "",
        year: "",
        condition: "",
        mileage: "",
        buy_price: "",
        sell_price: "",
        transmission: "",
        description: "",
      });
    }
  }, [selectedCar]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {modalType === "create" ? "Add New Car" : "Edit Car"}
          </DialogTitle>
          <DialogDescription>
            {modalType === "create"
              ? "Fill in the details below to add a new car to the inventory."
              : "Update the car details using the form below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Changed brand input to select */}
            <div className="space-y-2">
              <label htmlFor="brand" className="text-sm font-medium">
                Brand
              </label>
              <select
                id="brand"
                name="brand"
                defaultValue={initialValues.brand}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Rest of the form remains the same */}
            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium">
                Model
              </label>
              <input
                id="model"
                name="model"
                type="text"
                defaultValue={initialValues.model}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* ... rest of your existing form fields ... */}
            <div className="space-y-2">
              <label htmlFor="body_type" className="text-sm font-medium">
                Body Type
              </label>
              <select
                id="body_type"
                name="body_type"
                defaultValue={initialValues.body_type}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Body Type</option>
                {bodyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                defaultValue={initialValues.year}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="condition" className="text-sm font-medium">
                Condition
              </label>
              <input
                id="condition"
                name="condition"
                type="number"
                defaultValue={initialValues.condition}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="mileage" className="text-sm font-medium">
                Mileage
              </label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                defaultValue={initialValues.mileage}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="buy_price" className="text-sm font-medium">
                Buy Price
              </label>
              <input
                id="buy_price"
                name="buy_price"
                type="number"
                defaultValue={initialValues.buy_price}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sell_price" className="text-sm font-medium">
                Sell Price
              </label>
              <input
                id="sell_price"
                name="sell_price"
                type="number"
                defaultValue={initialValues.sell_price}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="transmission" className="text-sm font-medium">
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                defaultValue={initialValues.transmission}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialValues.description}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="images" className="text-sm font-medium">
              Images
            </label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : modalType === "create"
                ? "Create"
                : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
