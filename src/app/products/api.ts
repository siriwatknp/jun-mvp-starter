export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  color: string;
  description: string;
  warranty: string;
  sizes: string[];
  material: string;
  careInstructions: string[];
  inStock: boolean;
}

// Mock API functions to simulate backend calls
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    price: 29.99,
    imageUrl: "https://placehold.co/150x150/2196f3/FFFFFF.png",
    color: "Blue",
    description:
      "A comfortable everyday essential. This classic t-shirt features a relaxed fit and premium cotton fabric for maximum comfort.",
    warranty: "30-day quality guarantee",
    sizes: ["S", "M", "L", "XL"],
    material: "100% Organic Cotton",
    careInstructions: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    inStock: true,
  },
  {
    id: "2",
    name: "Designer Jeans",
    price: 89.99,
    imageUrl: "https://placehold.co/150x150/2196f3/FFFFFF.png",
    color: "Blue",
    description:
      "Premium denim jeans with a modern fit. These designer jeans offer both style and durability for everyday wear.",
    warranty: "90-day quality guarantee",
    sizes: ["28", "30", "32", "34", "36"],
    material: "98% Cotton, 2% Elastane",
    careInstructions: ["Machine wash cold", "Line dry", "Wash inside out"],
    inStock: true,
  },
  {
    id: "3",
    name: "Winter Jacket",
    price: 199.99,
    imageUrl: "https://placehold.co/150x150/4caf50/FFFFFF.png",
    color: "Green",
    description:
      "Stay warm during cold weather with this insulated winter jacket. Features water-resistant outer shell and cozy lining.",
    warranty: "1-year limited warranty",
    sizes: ["S", "M", "L", "XL", "XXL"],
    material:
      "Shell: 100% Polyester, Lining: 100% Recycled Polyester, Filling: Down Alternative",
    careInstructions: ["Dry clean only", "Do not iron", "Do not bleach"],
    inStock: true,
  },
  {
    id: "4",
    name: "Casual Sneakers",
    price: 69.99,
    imageUrl: "https://placehold.co/150x150/FFFFFF/000000.png",
    color: "White",
    description:
      "Versatile sneakers perfect for everyday wear. Featuring cushioned insoles and durable outsoles for all-day comfort.",
    warranty: "6-month manufacturer warranty",
    sizes: ["7", "8", "9", "10", "11", "12"],
    material: "Outer: Synthetic Leather, Sole: Rubber",
    careInstructions: [
      "Wipe with damp cloth",
      "Air dry",
      "Use shoe cleaner for stains",
    ],
    inStock: true,
  },
  {
    id: "5",
    name: "Summer Dress",
    price: 49.99,
    imageUrl: "https://placehold.co/150x150/f44336/FFFFFF.png",
    color: "Red",
    description:
      "A light and flowy summer dress perfect for warm days. Features a flattering silhouette and breathable fabric.",
    warranty: "30-day quality guarantee",
    sizes: ["XS", "S", "M", "L"],
    material: "95% Rayon, 5% Spandex",
    careInstructions: [
      "Hand wash cold",
      "Line dry",
      "Iron on low heat if needed",
    ],
    inStock: true,
  },
  {
    id: "6",
    name: "Leather Wallet",
    price: 39.99,
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF.png",
    color: "Black",
    description:
      "A slim and stylish leather wallet with multiple card slots and a bill compartment. Perfect for everyday use.",
    warranty: "2-year limited warranty",
    sizes: ["One Size"],
    material: "Genuine Leather",
    careInstructions: [
      "Wipe with dry cloth",
      "Apply leather conditioner occasionally",
    ],
    inStock: true,
  },
  {
    id: "7",
    name: "Smartphone Case",
    price: 19.99,
    imageUrl: "https://placehold.co/150x150/ffeb3b/000000.png",
    color: "Yellow",
    description:
      "Protect your smartphone with this durable case. Offers shock absorption and a slim profile.",
    warranty: "Lifetime warranty",
    sizes: ["iPhone 12/13", "iPhone 12/13 Pro", "Samsung Galaxy S21"],
    material: "TPU and Polycarbonate",
    careInstructions: [
      "Wipe with damp cloth",
      "Keep away from harsh chemicals",
    ],
    inStock: false,
  },
  {
    id: "8",
    name: "Sunglasses",
    price: 59.99,
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF.png",
    color: "Black",
    description:
      "Classic sunglasses with UV protection. Lightweight frame and polarized lenses for comfortable wear.",
    warranty: "1-year manufacturer warranty",
    sizes: ["One Size"],
    material: "Frame: Acetate, Lenses: Polycarbonate",
    careInstructions: [
      "Clean with lens cloth",
      "Store in protective case when not in use",
    ],
    inStock: true,
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
