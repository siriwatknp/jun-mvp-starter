"use client";

import { Drawer } from "vaul";
import { Product } from "@/app/products/api";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDrawer({
  product,
  open,
  onOpenChange,
}: ProductDrawerProps) {
  if (!product) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none">
          {/* Restructure to have a scrollable area and a fixed footer */}
          <div className="flex flex-col h-full">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 bg-white rounded-t-[10px]">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />

                {/* Content container with max-width */}
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <button
                      onClick={() => onOpenChange(false)}
                      className="absolute right-0 top-0 p-2 rounded-full bg-white shadow-sm"
                      aria-label="Close drawer"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {/* Image and basic info */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-full h-56 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={`${product.name} in ${product.color}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="text-xl font-semibold mb-1">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 font-medium text-lg mb-2">
                        ${product.price.toFixed(2)}
                      </p>
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300 mb-4"
                        style={{
                          backgroundColor: product.color
                            ? product.color.toLowerCase() === "white"
                              ? "#ffffff"
                              : product.color.toLowerCase()
                            : "#ccc",
                        }}
                        title={`Color: ${product.color}`}
                        aria-label={`Color: ${product.color}`}
                      />
                      <div className="w-full flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product description */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-gray-600">
                        {product.description}
                      </p>
                    </div>

                    {/* Sizes */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Available Sizes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Material info */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Material
                      </h3>
                      <p className="text-sm text-gray-600">
                        {product.material}
                      </p>
                    </div>

                    {/* Care instructions */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Care Instructions
                      </h3>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {product.careInstructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Warranty */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Warranty
                      </h3>
                      <p className="text-sm text-gray-600">
                        {product.warranty}
                      </p>
                    </div>

                    {/* Add bottom padding to ensure content isn't hidden behind sticky button */}
                    <div className="h-20"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed footer with Add to Cart button */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 mt-auto">
              <div className="max-w-md mx-auto">
                <button
                  className={cn(
                    "w-full py-3 rounded-lg font-medium",
                    product.inStock
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
