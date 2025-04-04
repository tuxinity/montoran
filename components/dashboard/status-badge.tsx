import { Sale } from "@/types/sales";
import { Badge } from "../ui/badge";

export const StatusBadge: React.FC<{ status: Sale["status"] }> = ({
  status,
}) => {
  const statusColors = {
    completed: "bg-green-500",
    pending: "bg-yellow-500",
    cancelled: "bg-red-500",
  };

  return (
    <Badge className={statusColors[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
