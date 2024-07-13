import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Statistics({ catches }) {
  const totalCatches = catches.length;
  const uniqueLocations = new Set(catches.map(c => c.location)).size;
  const allTags = catches.flatMap(c => c.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const mostCommonTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const catchesByMonth = catches.reduce((acc, c) => {
    const month = new Date(c.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(catchesByMonth).map(([month, count]) => ({ month, count }));

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
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Catches by Month</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}