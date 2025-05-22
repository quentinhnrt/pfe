import { cn } from "@/lib/utils";
import { LucideLoader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <LucideLoader2
      className={cn("animate-spin text-muted-foreground", className)}
    />
  );
}
