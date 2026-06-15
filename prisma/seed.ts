import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const drones = await prisma.category.create({
    data: { name: 'Drones', description: 'High-end aerial photography drones' }
  });
  
  const cameras = await prisma.category.create({
    data: { name: 'Cameras', description: 'Professional DSLR and Mirrorless cameras' }
  });
  
  const camping = await prisma.category.create({
    data: { name: 'Camping', description: 'Outdoor and survival gear' }
  });

  const tools = await prisma.category.create({
    data: { name: 'Tools', description: 'Power tools for construction and DIY' }
  });

  // Create Subcategory Example
  const actionCams = await prisma.category.create({
    data: { name: 'Action Cameras', description: 'GoPro and action cams', parentId: cameras.id }
  });

  // Create Items
  await prisma.item.create({
    data: {
      categoryId: drones.id,
      name: 'DJI Mavic 3 Pro',
      description: 'Professional drone with Hasselblad camera, 4K video, and 46 min flight time. Perfect for cinematic shots.',
      photoUrl: 'https://images.unsplash.com/photo-1504280650214-41d1e4eb41ce?q=80&w=2000&auto=format&fit=crop',
      pricePerDay: 45,
      deposit: 500,
      averageRating: 4.9,
      reviewCount: 24
    }
  });

  await prisma.item.create({
    data: {
      categoryId: cameras.id,
      name: 'Sony A7 IV',
      description: 'Full-frame mirrorless camera with 33MP sensor and 4K 60p video. Includes 24-70mm f/2.8 lens.',
      photoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      pricePerDay: 60,
      deposit: 800,
      averageRating: 4.8,
      reviewCount: 18
    }
  });

  await prisma.item.create({
    data: {
      categoryId: camping.id,
      name: 'North Face 4-Person Tent',
      description: 'All-season premium tent. Waterproof, wind-resistant, and sets up in under 5 minutes.',
      photoUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=1000&auto=format&fit=crop',
      pricePerDay: 25,
      deposit: 150,
      averageRating: 4.6,
      reviewCount: 42
    }
  });

  await prisma.item.create({
    data: {
      categoryId: tools.id,
      name: 'DeWalt 20V Max Drill',
      description: 'Cordless drill/driver kit with 2 batteries and charger. Ideal for home improvement projects.',
      photoUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
      pricePerDay: 15,
      deposit: 100,
      averageRating: 4.7,
      reviewCount: 56
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
