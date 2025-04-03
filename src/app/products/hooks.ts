"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, getAvailableColors } from "./api";

// Hooks
export function useProducts(priceSort?: "low" | "high", colorFilter?: string) {
  return useQuery({
    queryKey: ["products", { priceSort, colorFilter }],
    queryFn: () => getProducts(priceSort, colorFilter),
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  });
}

export function useAvailableColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: getAvailableColors,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}
