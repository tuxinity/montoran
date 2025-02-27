import { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import type { Car, BodyType, Brand, Model } from "@/types/car";
import Image from "next/image";
import CarApi from "@/lib/car-api";
import { useToast } from "@/hooks/use-toast";

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  modalType: "create" | "edit";
  bodyTypes: BodyType[];
  brands: Brand[];
  selectedCar?: Car;
  onBrandAdded?: () => Promise<void>;
  onModelAdded?: () => Promise<void>;
}

const TRANSMISSION_OPTIONS = [
  { label: "Automatic", value: "Automatic" },
  { label: "Manual", value: "Manual" },
] as const;

export function CarForm({
  open,
  onClose,
  onSubmit,
  loading,
  modalType,
  bodyTypes,
  brands,
  selectedCar,
  onBrandAdded,
  onModelAdded,
}: CarFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [models, setModels] = useState<Model[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "" });
  const [brandsState, setBrandsState] = useState<Brand[]>(brands);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModel, setNewModel] = useState({
    name: "",
    bodyTypeId: "",
    seats: 0,
    cc: 0,
    bags: 0,
  });
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Filter models based on selected brand
  const filteredModels = selectedBrand
    ? models.filter((model) => model.brand === selectedBrand)
    : models;

  // Reset form when selectedCar changes or when opening the form
  useEffect(() => {
    if (selectedCar && modalType === "edit") {
      // Set selected brand from the car's model
      const brandId = selectedCar.expand?.model?.brand;

      if (brandId) setSelectedBrand(brandId);

      // Reset form with car data
      const initialValues = {
        model: selectedCar.model || "",
        condition: selectedCar.condition || "",
        transmission: selectedCar.transmission || "",
        mileage: selectedCar.mileage || "",
        buy_price: selectedCar.buy_price || "",
        sell_price: selectedCar.sell_price || "",
        year: selectedCar.year || "",
        description: selectedCar.description || "",
      };

      reset(initialValues);
      setIsFormChanged(false); // Reset changed state

      // Set existing images
      setExistingImages(selectedCar.images || []);
      setImageFiles([]);
    } else if (modalType === "create") {
      // Reset form for create mode
      reset({
        model: "",
        year: "",
        condition: "",
        mileage: "",
        buy_price: "",
        sell_price: "",
        transmission: "",
        description: "",
      });
      setSelectedBrand("");
      setExistingImages([]);
      setImageFiles([]);
    }
  }, [selectedCar, modalType, reset, open]);

  // Update brands state when props change
  useEffect(() => {
    setBrandsState(brands);
  }, [brands]);

  // Load models when selected brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (selectedBrand) {
        setIsLoadingModels(true);
        try {
          const modelData = await CarApi.getModels({
            filter: `brand="${selectedBrand}"`,
          });
          setModels(modelData);
        } catch (error) {
          console.error("Error loading models:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load models",
          });
        } finally {
          setIsLoadingModels(false);
        }
      }
    };

    loadModels();
  }, [selectedBrand, toast]);

  // Update useEffect to handle preview URLs
  useEffect(() => {
    // Cleanup old preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Create new preview URLs
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup on unmount
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles]);

  // Watch all fields to detect changes
  useEffect(() => {
    if (modalType === "edit") {
      const subscription = watch((value, { type }) => {
        if (type === "change") {
          const hasChanged = Object.keys(value).some((key) => {
            const formValue = value[key];
            const carValue = selectedCar?.[key as keyof Car];
            return formValue !== carValue;
          });
          setIsFormChanged(hasChanged);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, modalType, selectedCar]);

  const onSubmitForm = async (data: FieldValues) => {
    try {
      if (!selectedBrand) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a brand first",
        });
        return;
      }

      const formData = new FormData();
      const typedData = data as FieldValues;

      // Get selected model data
      const selectedModel = models.find(
        (model) => model.id === typedData.model
      );
      if (!selectedModel) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a valid model",
        });
        return;
      }

      const carData = {
        model: selectedModel.name,
        brand: brandsState.find((b) => b.id === selectedBrand)?.name || "",
        body_type: selectedModel.expand?.body_type?.name || "",
        condition: parseInt(typedData.condition),
        transmission: typedData.transmission as "Automatic" | "Manual",
        mileage: parseInt(typedData.mileage),
        buy_price: parseInt(typedData.buy_price),
        sell_price: parseInt(typedData.sell_price),
        year: parseInt(typedData.year),
        description: typedData.description,
      };

      // Convert to FormData
      Object.entries(carData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Handle images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await onSubmit(formData);

      toast({
        title: "Success",
        description: "Car created successfully",
      });

      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create car",
      });
    }
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

  const handleAddBrand = async () => {
    try {
      // Create brand with the correct data structure
      const newBrandData = await CarApi.createBrand({
        name: newBrand.name,
      });

      // Update brands state
      setBrandsState((prevBrands) => [...prevBrands, newBrandData]);

      // Select the newly created brand
      setSelectedBrand(newBrandData.id);

      // Call the callback if provided
      if (onBrandAdded) {
        await onBrandAdded();
      }

      // Reset adding state
      setIsAddingBrand(false);
      setNewBrand({ name: "" });

      toast({
        title: "Success",
        description: `Brand "${newBrandData.name}" added successfully`,
      });
    } catch (error) {
      console.error("Error adding brand:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add brand",
      });
    }
  };

  const handleAddModel = async () => {
    try {
      if (!selectedBrand || !newModel.name || !newModel.bodyTypeId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill all required fields",
        });
        return;
      }

      // Create the new model
      const newModelData = await CarApi.createModel({
        name: newModel.name,
        brand: selectedBrand,
        body_type: newModel.bodyTypeId,
        seats: newModel.seats,
        cc: newModel.cc,
        bags: newModel.bags,
      });

      // Add the new model to the models list so it shows in the dropdown immediately
      setModels((prevModels) => [...prevModels, newModelData]);

      // Set the newly created model as selected
      setValue("model", newModelData.id);

      // Reset form
      setNewModel({
        name: "",
        bodyTypeId: "",
        seats: 0,
        cc: 0,
        bags: 0,
      });
      setIsAddingModel(false);

      // Refresh models from server to ensure consistency
      if (onModelAdded) {
        await onModelAdded();
      } else {
        // If no callback provided, refresh models directly
        const updatedModels = await CarApi.getModels({
          filter: `brand="${selectedBrand}"`,
        });
        setModels(updatedModels);
      }

      toast({
        title: "Success",
        description: "Model added successfully",
      });
    } catch (error) {
      console.error("Error adding model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add model",
      });
    }
  };

  const handleEditModel = async () => {
    try {
      if (!selectedBrand || !newModel.name || !newModel.bodyTypeId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill all required fields",
        });
        return;
      }

      // Get current model ID
      const currentModelId = watch("model");

      const updatedModel = await CarApi.updateModel(currentModelId, {
        name: newModel.name,
        brand: selectedBrand,
        body_type: newModel.bodyTypeId,
        seats: newModel.seats,
        cc: newModel.cc,
        bags: newModel.bags,
      });

      // Update the model in the local state
      setModels((prevModels) =>
        prevModels.map((model) =>
          model.id === updatedModel.id ? updatedModel : model
        )
      );

      // Reset form
      setNewModel({
        name: "",
        bodyTypeId: "",
        seats: 0,
        cc: 0,
        bags: 0,
      });
      setIsAddingModel(false);

      // Refresh models
      if (onModelAdded) {
        await onModelAdded();
      } else {
        // If no callback provided, refresh models directly
        const updatedModels = await CarApi.getModels({
          filter: `brand="${selectedBrand}"`,
        });
        setModels(updatedModels);
      }

      toast({
        title: "Success",
        description: "Model updated successfully",
      });
    } catch (error) {
      console.error("Error updating model:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model",
      });
    }
  };

  const handleEditModelClick = async () => {
    const selectedModelId = watch("model");
    const selectedModel = models.find((model) => model.id === selectedModelId);

    if (selectedModel) {
      setNewModel({
        name: selectedModel.name,
        bodyTypeId: selectedModel.body_type,
        seats: selectedModel.seats,
        cc: selectedModel.cc,
        bags: selectedModel.bags,
      });
      setIsAddingModel(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[50%] max-h-[90vh] p-0 rounded-lg shadow-lg bg-white flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
            {modalType === "create" ? "Add New Car" : "Edit Car"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-center mt-2">
            Select brand and model to create a car listing.
          </DialogDescription>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Brand and Model Selection */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Car Selection
              </h3>
              <div className="space-y-4">
                {/* Brand Selection with Add Brand Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Brand</Label>
                    <Popover
                      open={isAddingBrand}
                      onOpenChange={setIsAddingBrand}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New Brand
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h5 className="font-medium">Add New Brand</h5>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAddingBrand(false)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4 rotate-45" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label>Brand Name</Label>
                            <Input
                              value={newBrand.name}
                              onChange={(e) =>
                                setNewBrand({ name: e.target.value })
                              }
                              placeholder="Enter brand name"
                              className="bg-white"
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={handleAddBrand}
                            disabled={!newBrand.name}
                          >
                            Add Brand
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <select
                    className="w-full p-3 border rounded-lg bg-white"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      // Reset model selection when brand changes
                      setValue("model", "");
                    }}
                    required
                  >
                    <option value="">Choose a brand</option>
                    {brandsState.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Selection with Add/Edit Model Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Car Model</Label>
                    <Popover
                      open={isAddingModel}
                      onOpenChange={setIsAddingModel}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600"
                          disabled={
                            !selectedBrand ||
                            (modalType === "edit" && !watch("model"))
                          }
                          onClick={
                            modalType === "edit"
                              ? handleEditModelClick
                              : undefined
                          }
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {modalType === "edit" ? "Edit Model" : "New Model"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-medium">
                              {modalType === "edit"
                                ? "Edit Model"
                                : "Add New Model"}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAddingModel(false)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4 rotate-45" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Model Name</Label>
                              <Input
                                value={newModel.name}
                                onChange={(e) =>
                                  setNewModel((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                placeholder="Enter model name"
                                className="bg-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Body Type</Label>
                              <select
                                value={newModel.bodyTypeId}
                                onChange={(e) =>
                                  setNewModel((prev) => ({
                                    ...prev,
                                    bodyTypeId: e.target.value,
                                  }))
                                }
                                className="w-full p-2.5 border rounded-lg bg-white"
                              >
                                <option value="">Select Type</option>
                                {bodyTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label>Seats</Label>
                                <Input
                                  type="number"
                                  value={newModel.seats}
                                  onChange={(e) =>
                                    setNewModel((prev) => ({
                                      ...prev,
                                      seats: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="bg-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Engine (CC)</Label>
                                <Input
                                  type="number"
                                  value={newModel.cc}
                                  onChange={(e) =>
                                    setNewModel((prev) => ({
                                      ...prev,
                                      cc: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="bg-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bags</Label>
                                <Input
                                  type="number"
                                  value={newModel.bags}
                                  onChange={(e) =>
                                    setNewModel((prev) => ({
                                      ...prev,
                                      bags: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="bg-white"
                                />
                              </div>
                            </div>

                            <Button
                              className="w-full"
                              onClick={
                                modalType === "edit"
                                  ? handleEditModel
                                  : handleAddModel
                              }
                              disabled={
                                !newModel.name ||
                                !newModel.bodyTypeId ||
                                !selectedBrand
                              }
                            >
                              {modalType === "edit"
                                ? "Update Model"
                                : "Add Model"}
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <select
                    {...register("model", { required: true })}
                    className="w-full p-3 border rounded-lg bg-white"
                    disabled={!selectedBrand || isLoadingModels}
                  >
                    <option value="">
                      {isLoadingModels ? "Loading models..." : "Choose a model"}
                    </option>
                    {!isLoadingModels &&
                      filteredModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.expand?.body_type?.name} •{" "}
                          {model.seats} seats • {model.cc}cc
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Car Specifications */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Car Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    {...register("year", { required: true })}
                    className="bg-white"
                    placeholder="e.g., 2023"
                    defaultValue={selectedCar?.year || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Condition (%)</Label>
                  <Input
                    type="number"
                    {...register("condition", {
                      required: true,
                      min: 0,
                      max: 100,
                    })}
                    className="bg-white"
                    placeholder="e.g., 90 (0-100)"
                    defaultValue={selectedCar?.condition || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <select
                    {...register("transmission", { required: true })}
                    className="w-full p-3 border rounded-lg bg-white"
                    defaultValue={selectedCar?.transmission || ""}
                  >
                    <option value="">Select type</option>
                    {TRANSMISSION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Mileage (km)</Label>
                  <Input
                    type="number"
                    {...register("mileage", { required: true })}
                    className="bg-white"
                    placeholder="e.g., 5000"
                    defaultValue={selectedCar?.mileage || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buy Price</Label>
                  <Input
                    type="number"
                    {...register("buy_price", { required: true })}
                    className="bg-white"
                    placeholder="Enter amount"
                    defaultValue={selectedCar?.buy_price || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sell Price</Label>
                  <Input
                    type="number"
                    {...register("sell_price", { required: true })}
                    className="bg-white"
                    placeholder="Enter amount"
                    defaultValue={selectedCar?.sell_price || ""}
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Additional Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    {...register("description", { required: true })}
                    className="w-full p-3 border rounded-lg bg-white min-h-[100px]"
                    placeholder="Enter detailed description of the car..."
                    defaultValue={selectedCar?.description || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-gray-200 cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload multiple images. Supported formats: JPG, PNG
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative aspect-video">
                        <Image
                          src={
                            selectedCar
                              ? CarApi.getImageUrl(selectedCar, image)
                              : ""
                          }
                          alt={`Car image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`New car image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onLoad={(e) => {
                            URL.revokeObjectURL(
                              (e.target as HTMLImageElement).src
                            );
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmitForm)}
              disabled={loading || (modalType === "edit" && !isFormChanged)}
            >
              {loading
                ? "Saving..."
                : modalType === "create"
                ? "Create Car"
                : "Update Car"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
