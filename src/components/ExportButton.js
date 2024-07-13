import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportButton({ catches }) {
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(catches, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "fishing_catches.json";
    link.click();
  };

  return (
    <Button onClick={exportData} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export Catches
    </Button>
  );
}