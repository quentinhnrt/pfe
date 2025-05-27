"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Label } from "@/components/ui/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { toast } from "sonner";

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme || "system");

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    setTheme(value);
    toast.success("Theme updated", {
      description: `Theme has been changed to ${value}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose the theme for the application. Select the system theme to
            automatically switch between light and dark mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedTheme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Sun className="h-6 w-6 mb-3 text-orange-500" />
                <span className="block w-full text-center font-medium text-black">
                  Light
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-zinc-950 p-4 hover:bg-zinc-900 hover:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Moon className="h-6 w-6 mb-3 text-sky-300" />
                <span className="block w-full text-center font-medium text-white">
                  Dark
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white dark:bg-zinc-950 p-4 hover:opacity-90 hover:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex mb-3">
                  <Sun className="h-6 w-6 text-orange-500" />
                  <Moon className="h-6 w-6 ml-2 text-sky-300" />
                </div>
                <span className="block w-full text-center font-medium text-black dark:text-white">
                  System
                </span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Display</CardTitle>
          <CardDescription>
            Control how content appears in your feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline">Compact</Button>
          <Button variant="default">Standard</Button>
        </CardContent>
      </Card>
    </div>
  );
}
