export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  color: string;
}

// Mock API functions to simulate backend calls
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    price: 29.99,
    imageUrl: "https://placehold.co/150x150/2196f3/FFFFFF.png",
    color: "Blue",
  },
  {
    id: "2",
    name: "Designer Jeans",
    price: 89.99,
    imageUrl: "https://placehold.co/150x150/2196f3/FFFFFF.png",
    color: "Blue",
  },
  {
    id: "3",
    name: "Winter Jacket",
    price: 199.99,
    imageUrl: "https://placehold.co/150x150/4caf50/FFFFFF.png",
    color: "Green",
  },
  {
    id: "4",
    name: "Casual Sneakers",
    price: 69.99,
    imageUrl: "https://placehold.co/150x150/FFFFFF/000000.png",
    color: "White",
  },
  {
    id: "5",
    name: "Summer Dress",
    price: 49.99,
    imageUrl: "https://placehold.co/150x150/f44336/FFFFFF.png",
    color: "Red",
  },
  {
    id: "6",
    name: "Leather Wallet",
    price: 39.99,
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF.png",
    color: "Black",
  },
  {
    id: "7",
    name: "Smartphone Case",
    price: 19.99,
    imageUrl: "https://placehold.co/150x150/ffeb3b/000000.png",
    color: "Yellow",
  },
  {
    id: "8",
    name: "Sunglasses",
    price: 59.99,
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF.png",
    color: "Black",
  },
];

// Mock API function to get products
export const getProducts = async (
  priceSort?: "low" | "high",
  colorFilter?: string
): Promise<Product[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let filteredProducts = [...mockProducts];

  // Apply color filter if provided
  if (colorFilter) {
    filteredProducts = filteredProducts.filter(
      (product) => product.color === colorFilter
    );
  }

  // Apply price sorting if provided
  if (priceSort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return filteredProducts;
};

// Get all available colors
export const getAvailableColors = async (): Promise<string[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const colors = [...new Set(mockProducts.map((product) => product.color))];
  return colors;
};

// Color map for the swatches
export const colorMap: Record<string, string> = {
  Red: "#f44336",
  Blue: "#2196f3",
  Green: "#4caf50",
  Yellow: "#ffeb3b",
  Black: "#000000",
  White: "#ffffff",
};
