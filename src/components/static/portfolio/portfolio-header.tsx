import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PortfolioHeaderProps {
  portfolio: {
    title: string;
    description: string;
  };
}

export function PortfolioHeader({ portfolio }: PortfolioHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{portfolio.title}</h1>
        <p className="text-muted-foreground mt-1">{portfolio.description}</p>
      </div>
      <Button className="mt-4 md:mt-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Artwork
      </Button>
    </div>
  );
}
