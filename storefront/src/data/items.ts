export interface Item {
  id: string;
  title: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  rating: number;
  imageUrl: string;
  category: string;
}

export const ITEMS: Item[] = [
  {
    id: "1",
    title: "DJI Mavic 3 Pro Drone",
    description: "Professional-grade drone with triple-camera system, 4K video, and extended flight time. Perfect for cinematic aerial shots.",
    pricePerDay: 85,
    deposit: 500,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=2070&auto=format&fit=crop",
    category: "Electronics",
  },
  {
    id: "2",
    title: "Sony A7 III Mirrorless Camera",
    description: "Full-frame interchangeable lens camera with advanced autofocus and stunning 4K HDR video capabilities.",
    pricePerDay: 45,
    deposit: 300,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
    category: "Photography",
  },
  {
    id: "3",
    title: "North Face 4-Person Tent",
    description: "Durable and spacious 4-season tent. Weather-resistant materials ensure you stay dry and comfortable in any condition.",
    pricePerDay: 25,
    deposit: 100,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1504280650214-41d1e4eb41ce?q=80&w=2000&auto=format&fit=crop",
    category: "Outdoors",
  },
  {
    id: "4",
    title: "DeWalt 20V Max Cordless Drill",
    description: "High-performance cordless drill/driver kit with 2 batteries. Ideal for professional contractors and serious DIYers.",
    pricePerDay: 15,
    deposit: 80,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=2000&auto=format&fit=crop",
    category: "Tools",
  },
  {
    id: "5",
    title: "Red Digital Cinema Camera",
    description: "Industry-leading cinema camera for ultimate image quality and dynamic range. Includes basic lens kit.",
    pricePerDay: 250,
    deposit: 1500,
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1589808605335-51e0bc6e1e80?q=80&w=2000&auto=format&fit=crop",
    category: "Photography",
  },
  {
    id: "6",
    title: "Stand Up Paddleboard (SUP)",
    description: "Inflatable 10'6\" paddleboard. Very stable, perfect for beginners and intermediate riders on lakes or calm oceans.",
    pricePerDay: 35,
    deposit: 150,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=2000&auto=format&fit=crop",
    category: "Outdoors",
  }
];
