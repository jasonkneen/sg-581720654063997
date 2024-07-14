import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Custom XAxis component with default props as parameters
const CustomXAxis = ({ dataKey = 'name', ...props }) => <XAxis dataKey={dataKey} {...props} />;

// Custom YAxis component with default props as parameters
const CustomYAxis = ({ ...props }) => <YAxis {...props} />;

export default function InteractiveStatistics({ catches }) {
  const [activeTab, setActiveTab] = useState("monthly");

  const getMonthlyCatches = () => {
    const monthlyData = catches.reduce((acc, c) => {
      const month = new Date(c.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  };

  const getTagDistribution = () => {
    const tagCounts = catches.flatMap(c => c.tags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  const getLocationDistribution = () => {
    const locationCounts = catches.reduce((acc, c) => {
      acc[c.location] = (acc[c.location] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  const chartAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Catch Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly Catches</TabsTrigger>
            <TabsTrigger value="tags">Top Tags</TabsTrigger>
            <TabsTrigger value="locations">Top Locations</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <motion.div {...chartAnimation}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getMonthlyCatches()}>
                  <CustomXAxis dataKey="month" />
                  <CustomYAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
          <TabsContent value="tags">
            <motion.div {...chartAnimation}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getTagDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getTagDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
          <TabsContent value="locations">
            <motion.div {...chartAnimation}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getLocationDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getLocationDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}