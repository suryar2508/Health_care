
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DietRecommendations() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Diet Recommendations</CardTitle>
        <CardDescription>Based on your health profile</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-healthcare-success" />
            <div>
              <p className="font-medium">Include more fiber-rich foods</p>
              <p className="text-sm text-muted-foreground">Whole grains, vegetables, and fruits</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-healthcare-success" />
            <div>
              <p className="font-medium">Reduce sodium intake</p>
              <p className="text-sm text-muted-foreground">Limit processed foods and added salt</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-healthcare-warning" />
            <div>
              <p className="font-medium">Avoid excessive caffeine</p>
              <p className="text-sm text-muted-foreground">Can increase blood pressure temporarily</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
