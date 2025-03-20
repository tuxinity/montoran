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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipe data untuk penjualan
type Sale = {
  id: string;
  date: string;
  customerName: string;
  carName: string;
  price: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
};

// Data dummy untuk contoh
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
    date: "2023-10-18",
    customerName: "Siti Rahayu",
    carName: "Honda Brio",
    price: 185000000,
    paymentMethod: "Credit",
    status: "pending",
  },
  {
    id: "S003",
    date: "2023-10-20",
    customerName: "Ahmad Hidayat",
    carName: "Suzuki Ertiga",
    price: 225000000,
    paymentMethod: "Cash",
    status: "completed",
  },
  {
    id: "S004",
    date: "2023-10-22",
    customerName: "Dewi Lestari",
    carName: "Daihatsu Xenia",
    price: 195000000,
    paymentMethod: "Credit",
    status: "cancelled",
  },
  {
    id: "S005",
    date: "2023-10-25",
    customerName: "Eko Prasetyo",
    carName: "Mitsubishi Xpander",
    price: 275000000,
    paymentMethod: "Cash",
    status: "completed",
  },
];

export default function SalesDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Sale>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fungsi untuk memuat data penjualan
  const loadSales = useCallback(() => {
    setLoading(true);

    // Simulasi API call dengan timeout
    setTimeout(() => {
      let filteredSales = [...DUMMY_SALES];

      // Filter berdasarkan pencarian
      if (search) {
        const searchLower = search.toLowerCase();
        filteredSales = filteredSales.filter(
          (sale) =>
            sale.customerName.toLowerCase().includes(searchLower) ||
            sale.carName.toLowerCase().includes(searchLower) ||
            sale.id.toLowerCase().includes(searchLower)
        );
      }

      // Filter berdasarkan status
      if (statusFilter && statusFilter !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.status === statusFilter
        );
      }

      // Filter berdasarkan metode pembayaran
      if (paymentFilter && paymentFilter !== "all") {
        filteredSales = filteredSales.filter(
          (sale) => sale.paymentMethod === paymentFilter
        );
      }

      // Urutkan data
      filteredSales.sort((a, b) => {
        if (sortField === "price") {
          return sortDirection === "asc"
            ? a.price - b.price
            : b.price - a.price;
        } else {
          const aValue = a[sortField].toString();
          const bValue = b[sortField].toString();
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });

      setSales(filteredSales);
      setLoading(false);
    }, 800);
  }, [search, statusFilter, paymentFilter, sortField, sortDirection]);

  // Fungsi untuk mengubah pengurutan
  const handleSort = (field: keyof Sale) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Memuat data saat komponen dimount atau filter berubah
  useEffect(() => {
    loadSales();
  }, [loadSales]);

  // Render status badge dengan warna yang sesuai
  const renderStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  idrFormat(
                    sales.reduce(
                      (sum, sale) =>
                        sum + (sale.status === "completed" ? sale.price : 0),
                      0
                    )
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  sales.filter((sale) => sale.status === "completed").length
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  sales.filter((sale) => sale.status === "pending").length
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
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

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPaymentFilter("all");
            }}
          >
            Clear Filters
          </Button>

          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Sales Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        ID
                        {sortField === "id" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === "date" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("customerName")}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortField === "customerName" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("carName")}
                    >
                      <div className="flex items-center">
                        Car
                        {sortField === "carName" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        {sortField === "price" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("paymentMethod")}
                    >
                      <div className="flex items-center">
                        Payment
                        {sortField === "paymentMethod" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" &&
                          (sortDirection === "asc" ? (
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Skeleton loading state
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-12" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-16" />
                          </td>
                          <td className="px-4 py-3">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Skeleton className="h-8 w-16 ml-auto" />
                          </td>
                        </tr>
                      ))
                  ) : sales.length === 0 ? (
                    // Empty state
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No sales found. Try adjusting your filters.
                      </td>
                    </tr>
                  ) : (
                    // Sales data
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
                          {renderStatusBadge(sale.status)}
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
