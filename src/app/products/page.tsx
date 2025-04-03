"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { colorMap } from "./api";
import { useProducts, useAvailableColors } from "./hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Skeleton loader component defined outside the main component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-32 bg-gray-200 rounded-xl mb-2"></div>
    <div className="w-2/3 h-4 bg-gray-200 rounded mt-1 mb-1"></div>
    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
  </div>
);

export default function ProductsPage() {
  const [priceSort, setPriceSort] = useState<"low" | "high" | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);

  // Use TanStack Query hooks instead of direct API calls
  const {
    data: products = [],
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useProducts(priceSort, selectedColor);

  const { data: availableColors = [], isLoading: colorsLoading } =
    useAvailableColors();

  // Display loading when fetching initial data or when switching between filters
  const loading = productsLoading || productsFetching;

  const handlePriceChange = (value: string) => {
    setPriceSort(value as "low" | "high");
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color === selectedColor ? undefined : color);
    setColorPopoverOpen(false);
  };

  const resetFilters = () => {
    setPriceSort(undefined);
    setSelectedColor(undefined);
    setColorPopoverOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-md overflow-hidden min-h-screen">
      {/* Header with logo */}
      <header className="relative h-20 border-b border-gray-200 flex items-center justify-center">
        <div className="absolute w-32 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center">
          <div className="flex items-center font-semibold text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>ShopApp</span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Price Filter using Select */}
        <div>
          <Select value={priceSort} onValueChange={handlePriceChange}>
            <SelectTrigger
              className={cn(
                "rounded-lg bg-white border-gray-300",
                priceSort ? "border-blue-500" : "border-gray-300",
                "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
              )}
            >
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Filter using Popover */}
        <div>
          <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 border rounded-lg text-gray-500 h-10",
                  selectedColor ? "border-blue-500" : "border-gray-300",
                  "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
                )}
                aria-label="Select color"
                disabled={colorsLoading}
              >
                <span>
                  {selectedColor ? `Color: ${selectedColor}` : "Color"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-3" align="start">
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border border-gray-300",
                      selectedColor === color ? "ring-2 ring-blue-500" : "",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    )}
                    style={{ backgroundColor: colorMap[color] || "#ccc" }}
                    title={color}
                    aria-label={`Color: ${color}`}
                    aria-pressed={selectedColor === color}
                  >
                    {selectedColor === color && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn(
                          "h-5 w-5",
                          color === "White" ? "text-black" : "text-white"
                        )}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Reset Filters */}
      {(priceSort || selectedColor) && (
        <div className="px-4 pb-2 -mt-2 flex justify-end">
          <button
            onClick={resetFilters}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label="Reset filters"
          >
            <X className="h-4 w-4 mr-1" aria-hidden="true" />
            Reset filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div
        className="p-4 grid grid-cols-2 gap-4"
        role="list"
        aria-label="Products"
      >
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <ProductSkeleton key={index} />)
          : products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm border border-gray-100"
                role="listitem"
              >
                <div className="w-full h-32 bg-gray-100 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={`${product.name} in ${product.color}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full text-sm font-medium mt-1">
                  {product.name}
                </div>
                <div className="w-full text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </div>
                <div
                  className="w-4 h-4 rounded-full mt-1 self-start border border-gray-300"
                  style={{ backgroundColor: colorMap[product.color] || "#ccc" }}
                  title={`Color: ${product.color}`}
                  aria-label={`Color: ${product.color}`}
                  role="presentation"
                ></div>
              </div>
            ))}
      </div>
    </div>
  );
}
