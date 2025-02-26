import { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Car, BodyType } from "@/types/car";
import Image from "next/image";
import { getImageUrl } from "@/lib/car-api";

interface Brand {
  id: string;
  name: string;
}

interface CarFormData {
  brand: string;
  model: string;
  body_type: string;
  year: number;
  condition: number;
  mileage: number;
  buy_price: number;
  sell_price: number;
  transmission: string;
  description: string;
}

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  modalType: "create" | "edit";
  bodyTypes: BodyType[];
  brands: Brand[];
  selectedCar?: Car;
}

export function CarForm({
  open,
  onClose,
  onSubmit,
  loading,
  modalType,
  bodyTypes,
  brands,
  selectedCar,
}: CarFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCar) {
      reset({
        brand: selectedCar.expand?.model?.expand?.brand?.id || "",
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
      const images = selectedCar.images || [];
      setExistingImages(images);
      setImageFiles([]);
    } else {
      reset({
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
      setExistingImages([]);
      setImageFiles([]);
    }
  }, [selectedCar, reset]);

  const onSubmitForm = async (data: FieldValues) => {
    const formData = new FormData();
    const typedData = data as CarFormData;

    Object.entries(typedData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    existingImages.forEach((image) => {
      formData.append("existingImages[]", image);
    });

    imageFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    await onSubmit(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[50%] max-h-[90vh] p-0 rounded-lg shadow-lg bg-white flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
            {modalType === "create" ? "Add New Car" : "Edit Car"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-center">
            {modalType === "create"
              ? "Fill in the details below to add a new car to the inventory."
              : "Update the car details using the form below."}
          </DialogDescription>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="brand" className="text-sm font-medium">
                  Brand
                </label>
                <select
                  id="brand"
                  {...register("brand", { required: true })}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  Model
                </label>
                <input
                  id="model"
                  {...register("model", { required: true })}
                  type="text"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="body_type" className="text-sm font-medium">
                  Body Type
                </label>
                <select
                  id="body_type"
                  {...register("body_type", { required: true })}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {...register("year", { required: true })}
                  type="number"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="condition" className="text-sm font-medium">
                  Condition
                </label>
                <input
                  id="condition"
                  {...register("condition", { required: true })}
                  type="number"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mileage" className="text-sm font-medium">
                  Mileage
                </label>
                <input
                  id="mileage"
                  {...register("mileage", { required: true })}
                  type="number"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="buy_price" className="text-sm font-medium">
                  Buy Price
                </label>
                <input
                  id="buy_price"
                  {...register("buy_price", { required: true })}
                  type="number"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sell_price" className="text-sm font-medium">
                  Sell Price
                </label>
                <input
                  id="sell_price"
                  {...register("sell_price", { required: true })}
                  type="number"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="transmission" className="text-sm font-medium">
                  Transmission
                </label>
                <select
                  id="transmission"
                  {...register("transmission", { required: true })}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="images" className="text-sm font-medium">
                  Images
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleImageChange}
                />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {existingImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden shadow-md"
                    >
                      <Image
                        src={selectedCar ? getImageUrl(selectedCar, image) : ""}
                        alt={`Existing Image ${index + 1}`}
                        width={100}
                        height={75}
                        className="w-full h-auto"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          removeExistingImage(index);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden shadow-md"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Selected Image ${index + 1}`}
                        width={100}
                        height={75}
                        className="w-full h-auto"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(index);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                {...register("description", { required: true })}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {loading
                ? "Saving..."
                : modalType === "create"
                ? "Create"
                : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
