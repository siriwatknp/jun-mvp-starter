"use client";

import { useState, useEffect } from "react";
import { Product, getProducts, getAvailableColors, colorMap } from "./api";

// Skeleton loader component defined outside the main component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-32 bg-gray-200 rounded-xl mb-2"></div>
    <div className="w-2/3 h-4 bg-gray-200 rounded mt-1 mb-1"></div>
    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceSort, setPriceSort] = useState<"low" | "high" | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showColorPopper, setShowColorPopper] = useState(false);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

  // Load initial colors
  useEffect(() => {
    const loadColors = async () => {
      try {
        const colors = await getAvailableColors();
        setAvailableColors(colors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    loadColors();
  }, []);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(priceSort, selectedColor);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [priceSort, selectedColor]);

  const togglePriceDropdown = () => {
    setShowPriceDropdown(!showPriceDropdown);
    setShowColorPopper(false);
  };

  const toggleColorPopper = () => {
    setShowColorPopper(!showColorPopper);
    setShowPriceDropdown(false);
  };

  const handlePriceSelect = (value: "low" | "high") => {
    setPriceSort(value);
    setShowPriceDropdown(false);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color === selectedColor ? undefined : color);
    setShowColorPopper(false);
  };

  const resetFilters = () => {
    setPriceSort(undefined);
    setSelectedColor(undefined);
    setShowPriceDropdown(false);
    setShowColorPopper(false);
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
        {/* Price Filter */}
        <div className="relative">
          <button
            onClick={togglePriceDropdown}
            className={`w-full flex items-center justify-between px-4 py-2 border ${
              priceSort ? "border-blue-500" : "border-gray-300"
            } rounded-lg text-gray-500`}
          >
            <span>
              {priceSort
                ? `Price: ${
                    priceSort === "low" ? "Low to High" : "High to Low"
                  }`
                : "Price"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-400 transition-transform ${
                showPriceDropdown ? "transform rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showPriceDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handlePriceSelect("low")}
                >
                  Low to High
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handlePriceSelect("high")}
                >
                  High to Low
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="relative">
          <button
            onClick={toggleColorPopper}
            className={`w-full flex items-center justify-between px-4 py-2 border ${
              selectedColor ? "border-blue-500" : "border-gray-300"
            } rounded-lg text-gray-500`}
          >
            <span>{selectedColor ? `Color: ${selectedColor}` : "Color"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-400 transition-transform ${
                showColorPopper ? "transform rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {showColorPopper && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 ${
                      selectedColor === color ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ backgroundColor: colorMap[color] || "#ccc" }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          color === "White" ? "text-black" : "text-white"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
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
            </div>
          )}
        </div>
      </div>

      {/* Reset Filters */}
      {(priceSort || selectedColor) && (
        <div className="px-4 pb-2 -mt-2 flex justify-end">
          <button
            onClick={resetFilters}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Reset filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <ProductSkeleton key={index} />)
          : products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm border border-gray-100"
              >
                <div className="w-full h-32 bg-gray-100 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
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
                  title={product.color}
                ></div>
              </div>
            ))}
      </div>
    </div>
  );
}
