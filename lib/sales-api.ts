import { pb } from "./pocketbase";
import { Sale } from "@/types/sales";
import { COLLECTIONS } from "./constants";

export type SalesFilter = {
  search?: string;
  status?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type SortConfig = {
  field: keyof Sale;
  direction: "asc" | "desc";
};

const SalesApi = {
  /**
   * Get all sales with optional filtering
   */
  getSales: async (
    filters?: SalesFilter,
    sort?: SortConfig
  ): Promise<Sale[]> => {
    try {
      const filterRules: string[] = [];

      if (filters?.search) {
        filterRules.push(
          `(customerName ~ "${filters.search}" || id ~ "${filters.search}")`
        );
      }

      if (filters?.status && filters.status !== "all") {
        filterRules.push(`status = "${filters.status}"`);
      }

      if (filters?.paymentMethod && filters.paymentMethod !== "all") {
        filterRules.push(`paymentMethod = "${filters.paymentMethod}"`);
      }

      if (filters?.dateFrom) {
        filterRules.push(`date >= "${filters.dateFrom}"`);
      }

      if (filters?.dateTo) {
        filterRules.push(`date <= "${filters.dateTo}"`);
      }

      const sortParam = sort
        ? `${sort.direction === "desc" ? "-" : ""}${sort.field}`
        : "-date";

      const records = await pb.collection(COLLECTIONS.SALES).getFullList<Sale>({
        sort: sortParam,
        filter: filterRules.length > 0 ? filterRules.join(" && ") : undefined,
        expand: "car,salesPerson",
        $autoCancel: false,
      });

      return records;
    } catch (error) {
      console.error("Error fetching sales:", error);
      throw error;
    }
  },

  getSaleById: async (id: string): Promise<Sale> => {
    try {
      const record = await pb.collection(COLLECTIONS.SALES).getOne<Sale>(id);
      return record;
    } catch (error) {
      console.error(`Error fetching sale ${id}`, error);
      throw error;
    }
  },

  createSale: async (data: Omit<Sale, "id">): Promise<Sale> => {
    try {
      // Mulai transaksi
      const sale = await pb.collection(COLLECTIONS.SALES).create<Sale>(data);

      // Update mobil menjadi sold
      if (data.car) {
        await pb.collection(COLLECTIONS.CARS).update(data.car, {
          is_sold: true,
        });
      }

      return sale;
    } catch (error) {
      console.error("Error creating sale:", error);
      throw error;
    }
  },

  updateSale: async (
    id: string,
    data: Partial<Omit<Sale, "id">>
  ): Promise<Sale> => {
    try {
      const record = await pb
        .collection(COLLECTIONS.SALES)
        .update<Sale>(id, data);
      return record;
    } catch (error) {
      console.error(`Error updating sale ${id}`, error);
      throw error;
    }
  },

  deleteSale: async (id: string): Promise<void> => {
    try {
      await pb.collection(COLLECTIONS.SALES).delete(id);
    } catch (error) {
      console.error(`Error deleting sale ${id}`, error);
      throw error;
    }
  },

  cancelSale: async (id: string): Promise<boolean> => {
    try {
      const sale = await pb.collection(COLLECTIONS.SALES).getOne<Sale>(id, {
        expand: "car",
      });

      await pb.collection(COLLECTIONS.SALES).update(id, {
        status: "cancelled",
      });

      if (sale.car) {
        await pb.collection(COLLECTIONS.CARS).update(sale.car, {
          is_sold: false,
        });
      }

      return true;
    } catch (error) {
      console.error(`Error cancelling sale ${id}:`, error);
      throw error;
    }
  },

  getSalesSummary: async (): Promise<{
    totalSales: number;
    completedSales: number;
    pendingSales: number;
    totalRevenue: number;
  }> => {
    try {
      const allSales = await pb
        .collection(COLLECTIONS.SALES)
        .getFullList<Sale>();

      const completedSales = allSales.filter(
        (sale) => sale.status === "completed"
      );
      const pendingSales = allSales.filter((sale) => sale.status === "pending");

      const totalRevenue = completedSales.reduce(
        (sum, sale) => sum + sale.price,
        0
      );

      return {
        totalSales: allSales.length,
        completedSales: completedSales.length,
        pendingSales: pendingSales.length,
        totalRevenue,
      };
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      throw error;
    }
  },
};

export default SalesApi;
