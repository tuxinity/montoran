"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getCars, deleteCar, createCar, updateCar } from "@/lib/pocketbase";
import type { Car, BodyType, Brand } from "@/types/car";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CarFilters, type FilterValues } from "@/components/car-filters";
import debounce from "lodash/debounce";
import { pb } from "@/lib/pocketbase";
import { SidebarDashboard } from "@/components/dashboard";
import { idrFormat } from "@/utils/idr-format";
import { CarForm } from "@/components/car-form";

export default function DashboardPage() {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});
  const [search, setSearch] = useState<string>("");
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const loadCars = useCallback(
    async (search?: string, filters?: FilterValues) => {
      setLoading(true);
      try {
        const carData = await getCars(search, filters);
        setCars(carData);
      } catch (error) {
        console.error("Error loading cars:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cars. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const debouncedLoadCars = useMemo(
    () =>
      debounce((search: string, filters: FilterValues) => {
        loadCars(search, filters);
      }, 500),
    [loadCars]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedLoadCars(value, filters);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    debouncedLoadCars(search, newFilters);
  };

  useEffect(() => {
    return () => {
      debouncedLoadCars.cancel();
    };
  }, [debouncedLoadCars]);

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        const records = await pb.collection("body_type").getFullList<BodyType>({
          $autoCancel: false,
        });
        setBodyTypes(records);
      } catch (error) {
        console.error("Error fetching body types:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load body types.",
        });
      }
    };
    const fetchBrand = async () => {
      try {
        const records = await pb.collection("brand").getFullList<BodyType>({
          $autoCancel: false,
        });
        setBrands(records);
      } catch (error) {
        console.error("Error fetching body types:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load body types.",
        });
      }
    };
    fetchBodyTypes();
    fetchBrand();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (modalType === "edit" && selectedCar) {
        await updateCar(selectedCar.id, formData);
        toast({
          title: "Car updated",
          description: "The car has been successfully updated.",
        });
      } else {
        await createCar(formData);
        toast({
          title: "Car created",
          description: "The new car has been successfully added.",
        });
      }

      await loadCars();
      closeModal();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCar) return;

    setLoading(true);
    try {
      await deleteCar(selectedCar.id);
      await loadCars();
      closeModal();
      toast({
        title: "Car deleted",
        description: "The car has been successfully deleted.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete car",
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: "create" | "edit" | "delete", car?: Car) => {
    setModalType(type);
    setSelectedCar(car || null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCar(null);
  };

  const renderCarForm = () => {
    // Only render if modalType is create or edit
    if (modalType === "create") {
      return (
        <CarForm
          open={true}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={loading}
          modalType="create"
          bodyTypes={bodyTypes}
          brands={brands}
        />
      );
    }

    if (modalType === "edit" && selectedCar) {
      return (
        <CarForm
          open={true}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={loading}
          modalType="edit"
          bodyTypes={bodyTypes}
          selectedCar={selectedCar}
          brands={brands}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarDashboard />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Car Inventory
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your car inventory and listings
            </p>
          </div>

          {/* Filters */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="w-full mx-auto">
            {/* Actions */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">All Cars</h2>
              <div className="flex px-6 py-4 border-t border-gray-100 gap-2">
                <CarFilters
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                />
                <Button
                  onClick={() => openModal("create")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Car
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-full align-middle">
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">Loading cars...</p>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead>
                        <tr className="bg-gray-50">
                          <th
                            scope="col"
                            className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Brand
                          </th>
                          <th
                            scope="col"
                            className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Model
                          </th>
                          <th
                            scope="col"
                            className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Transmission
                          </th>
                          <th
                            scope="col"
                            className="w-1/5 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cars.map((car) => (
                          <tr key={car.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {car.expand?.model?.expand?.brand?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {car.expand?.model?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {idrFormat(car.sell_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                {car.transmission}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openModal("edit", car)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => openModal("delete", car)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {renderCarForm()}

      {/* Delete Confirmation Dialog */}
      <Dialog open={modalType === "delete"} onOpenChange={() => closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this car? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Car"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
