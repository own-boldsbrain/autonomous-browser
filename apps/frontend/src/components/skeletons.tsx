import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EquipmentCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-6 w-3/4 bg-muted rounded animate-pulse mt-2" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse mt-1" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          <div className="flex gap-2 pt-2">
            <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <EquipmentCardSkeleton key={index} />
      ))}
    </div>
  );
}