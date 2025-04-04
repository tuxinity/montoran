"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DownloadIcon,
  PlusCircleIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { idrFormat } from "@/utils/idr-format";
import { Input } from "@/components/ui/input";
import {
  SalesSummaryCard,
  SortableHeader,
  StatusBadge,
} from "@/components/dashboard";
import { Sale } from "@/types/sales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DUMMY_SALES: Sale[] = [
  {
    id: "S001",
    date: "2023-10-15",
    customerName: "Budi Santoso",
    carName: "Toyota Avanza",
    price: 210000000,
    paymentMethod: "Cash",
    status: "completed",
  },
  {
    id: "S002",
    date: "2023-10-20",
    customerName: "Ade Yahya",
    carName: "Mitsubishi Lancer",
    price: 300000000,
    paymentMethod: "Cash",
    status: "completed",
  },
];

export default function SalesDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Sale;
    direction: "asc" | "desc";
  }>({ field: "date", direction: "desc" });

  const loadSales = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let filteredSales = [...DUMMY_SALES];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredSales = filteredSales.filter(
          (sale) =>
            sale.customerName.toLowerCase().includes(searchLower) ||
            sale.carName.toLowerCase().includes(searchLower) ||
            sale.id.toLowerCase().includes(searchLower),
        );
      }

      if (statusFilter && statusFilter !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.status === statusFilter,
        );
      }

      if (paymentFilter && paymentFilter !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.paymentMethod === paymentFilter,
        );
      }

      filteredSales.sort((a, b) => {
        const { field, direction } = sortConfig;

        if (field === "price") {
          return direction === "asc" ? a.price - b.price : b.price - a.price;
        }

        const aValue = a[field].toString();
        const bValue = b[field].toString();
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

      setSales(filteredSales);
      setLoading(false);
    }, 800);
  }, [search, statusFilter, paymentFilter, sortConfig]);

  const handleSort = (field: keyof Sale) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <Button>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SalesSummaryCard
            title="Total Sales"
            loading={loading}
            value={idrFormat(
              sales.reduce(
                (sum, sale) =>
                  sum + (sale.status === "completed" ? sale.price : 0),
                0,
              ),
            )}
          />
          <SalesSummaryCard
            title="Completed Sales"
            loading={loading}
            value={sales.filter((sale) => sale.status === "completed").length}
          />
          <SalesSummaryCard
            title="Pending Sales"
            loading={loading}
            value={sales.filter((sale) => sale.status === "pending").length}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, car, or ID..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit">Credit</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters}>
            Clear Filters
          </Button>

          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <SortableHeader
                      field="id"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      ID
                    </SortableHeader>
                    <SortableHeader
                      field="date"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Date
                    </SortableHeader>
                    <SortableHeader
                      field="customerName"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Customer
                    </SortableHeader>
                    <SortableHeader
                      field="carName"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Car
                    </SortableHeader>
                    <SortableHeader
                      field="price"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Price
                    </SortableHeader>
                    <SortableHeader
                      field="paymentMethod"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Payment
                    </SortableHeader>
                    <SortableHeader
                      field="status"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Status
                    </SortableHeader>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="border-b">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                            <td key={col} className="px-4 py-3">
                              <Skeleton className="h-5 w-24" />
                            </td>
                          ))}
                        </tr>
                      ))
                  ) : sales.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No sales found. Try adjusting your filters.
                      </td>
                    </tr>
                  ) : (
                    sales.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{sale.id}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {sale.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm">{sale.carName}</td>
                        <td className="px-4 py-3 text-sm">
                          {idrFormat(sale.price)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {sale.paymentMethod}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={sale.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
