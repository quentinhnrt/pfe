"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000])

  const specialties = [
    { id: "painting", label: "Painting" },
    { id: "sculpture", label: "Sculpture" },
    { id: "photography", label: "Photography" },
    { id: "digital", label: "Digital Art" },
    { id: "illustration", label: "Illustration" },
    { id: "street-art", label: "Street Art" },
  ]

  const locations = [
    { id: "paris", label: "Paris" },
    { id: "london", label: "London" },
    { id: "new-york", label: "New York" },
    { id: "berlin", label: "Berlin" },
    { id: "tokyo", label: "Tokyo" },
    { id: "sydney", label: "Sydney" },
  ]

  return (
    <div className="border rounded-lg p-4 sticky top-20">
      <h3 className="font-semibold mb-4">Filters</h3>

      <Accordion type="multiple" defaultValue={["specialty", "location"]}>
        <AccordionItem value="specialty">
          <AccordionTrigger>Specialty</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {specialties.map((specialty) => (
                <div key={specialty.id} className="flex items-center space-x-2">
                  <Checkbox id={specialty.id} />
                  <Label htmlFor={specialty.id}>{specialty.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox id={location.id} />
                  <Label htmlFor={location.id}>{location.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 5000]}
                max={10000}
                step={100}
                onValueChange={(value) => setPriceRange(value as number[])}
              />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  )
}
