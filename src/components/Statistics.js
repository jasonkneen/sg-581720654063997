import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Statistics({ catches }) {
  const totalCatches = catches.length;
  const uniqueLocations = new Set(catches.map(c => c.location)).size;
  const allTags = catches.flatMap(c => c.tags);
  const mostCommonTag = allTags.length > 0
    ? allTags.sort((a, b) =>
        allTags.filter(v => v === b).length - allTags.filter(v => v === a).length
      )[0]
    : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Catches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCatches}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueLocations}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Common Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostCommonTag}</div>
        </CardContent>
      </Card>
    </div>
  );
}