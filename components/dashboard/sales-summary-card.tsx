import { Card, CardHeader, CardTitle, CardContent } from "../ui";
import { Skeleton } from "@/components/ui/skeleton";

export const SalesSummaryCard: React.FC<{
  title: string;
  loading: boolean;
  value: number | string;
}> = ({ title, loading, value }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {loading ? <Skeleton className="h-8 w-24" /> : value}
      </div>
    </CardContent>
  </Card>
);
