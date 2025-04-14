"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DownloadIcon,
  PlusCircleIcon,
  SearchIcon,
  RefreshCw,
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
import SalesApi, { SalesFilter, SortConfig } from "@/lib/sales-api";
import { useToast } from "@/hooks/use-toast";
import { NewSaleDialog } from "@/components/dashboard/new-sale-dialog";

export default function SalesDashboard() {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "date",
    direction: "desc",
  });
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);
  const [summary, setSummary] = useState({
    totalSales: 0,
    completedSales: 0,
    pendingSales: 0,
    totalRevenue: 0,
  });

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      const filters: SalesFilter = {
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        paymentMethod: paymentFilter !== "all" ? paymentFilter : undefined,
      };

      const salesData = await SalesApi.getSales(filters, sortConfig);
      setSales(salesData);

      const summaryData = await SalesApi.getSalesSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading sales:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sales data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, paymentFilter, sortConfig, toast]);

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

  const handleNewSale = async (saleData: Omit<Sale, "id">) => {
    try {
      await SalesApi.createSale(saleData);
      toast({
        title: "Success",
        description: "Sale has been added successfully.",
      });
      loadSales();
      setShowNewSaleDialog(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add sale.",
      });
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        await SalesApi.deleteSale(id);
        toast({
          title: "Success",
          description: "Sale has been deleted successfully.",
        });
        loadSales();
      } catch {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete sale.",
        });
      }
    }
  };

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const exportToCSV = () => {
    if (sales.length === 0) return;

    const headers = [
      "ID",
      "Date",
      "Customer",
      "Car",
      "Price",
      "Payment",
      "Status",
    ];
    const csvData = sales.map((sale) => [
      sale.id,
      sale.date,
      sale.customerName,
      sale.expand?.car
        ? `${sale.expand.car.expand?.model?.expand?.brand?.name || ""} ${sale.expand.car.expand?.model?.name || ""} (${sale.expand.car.year})`
        : "Unknown",
      sale.price.toString(),
      sale.paymentMethod,
      sale.status,
      sale.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sales_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSales}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setShowNewSaleDialog(true)}>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SalesSummaryCard
            title="Total Sales"
            loading={loading}
            value={summary.totalSales}
          />
          <SalesSummaryCard
            title="Completed Sales"
            loading={loading}
            value={summary.completedSales}
          />
          <SalesSummaryCard
            title="Total Revenue"
            loading={loading}
            value={idrFormat(summary.totalRevenue)}
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

          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={sales.length === 0}
          >
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
                      field="car"
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
                        <td className="px-4 py-3 text-sm">{sale.car}</td>
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
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Info",
                                  description: "Edit feature coming soon",
                                });
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteSale(sale.id)}
                            >
                              Delete
                            </Button>
                          </div>
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

      <NewSaleDialog
        open={showNewSaleDialog}
        onClose={() => setShowNewSaleDialog(false)}
        onSubmit={handleNewSale}
      />
    </div>
  );
}
