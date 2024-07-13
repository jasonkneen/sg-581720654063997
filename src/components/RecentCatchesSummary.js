import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function RecentCatchesSummary({ catches }) {
  const recentCatches = catches.slice(0, 5); // Get the 5 most recent catches

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Catches</CardTitle>
      </CardHeader>
      <CardContent>
        {recentCatches.map((catchItem, index) => (
          <motion.div
            key={catchItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4 p-4 bg-secondary rounded-lg"
          >
            <h3 className="font-semibold">{catchItem.location}</h3>
            <p className="text-sm text-muted-foreground">{new Date(catchItem.date).toLocaleDateString()}</p>
            <p className="mt-2">{catchItem.description.slice(0, 100)}...</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}