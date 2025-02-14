import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BodyType, Car } from "@/types/car";

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  modalType: "create" | "edit" | "delete";
  bodyTypes: BodyType[];
  selectedCar: Car; // Adjust the type according to your Car type definition
}

export function CarForm({
  open,
  onClose,
  onSubmit,
  loading,
  modalType,
  bodyTypes,
  selectedCar,
}: CarFormProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-white rounded-xl shadow-2xl">
        <div className="relative bg-black p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {modalType === "create" ? "Add New Car" : "Edit Car"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1.5">
                Fill in the car details below. All fields marked with * are
                required.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Scrollable Content with Custom Scrollbar */}
        <div className="p-8 overflow-y-auto flex-1 max-h-[calc(90vh-240px)] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Basic Information
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Brand & Model */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Brand <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="brand"
                          placeholder="e.g., Toyota"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                          defaultValue={selectedCar.expand?.model.name || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Model <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="model"
                          placeholder="e.g., Camry"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                          defaultValue={selectedCar?.expand?.model.brand || ""}
                        />
                      </div>
                    </div>

                    {/* Body Type & Year */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Body Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="body_type"
                          required
                          defaultValue={
                            selectedCar.expand?.model.expand?.body_type.name ||
                            ""
                          }
                        >
                          <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bodyTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Year <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="year"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                          defaultValue={
                            selectedCar?.year || new Date().getFullYear()
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Technical Details
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Condition & Transmission */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Condition (%) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="condition"
                          type="number"
                          min="0"
                          max="100"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                          defaultValue={selectedCar?.condition || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Transmission <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="transmission"
                          required
                          defaultValue={selectedCar?.transmission || ""}
                        >
                          <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MT">Manual</SelectItem>
                            <SelectItem value="AT">Automatic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Mileage */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Mileage (km) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        name="mileage"
                        type="number"
                        min="0"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                        defaultValue={selectedCar?.mileage || ""}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Pricing Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Pricing
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Buy Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="buy_price"
                          type="number"
                          min="0"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                          defaultValue={selectedCar?.buy_price || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Sell Price <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="sell_price"
                          type="number"
                          min="0"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          required
                          defaultValue={selectedCar?.sell_price || ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Additional Information
                    </h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        name="description"
                        className="w-full min-h-[150px] p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        placeholder="Enter detailed description..."
                        required
                        defaultValue={selectedCar?.description || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Images{" "}
                        {!selectedCar && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="images"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload files</span>
                              <Input
                                id="images"
                                name="images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="sr-only"
                                required={!selectedCar}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    {modalType === "create" ? "Add Car" : "Update Car"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
