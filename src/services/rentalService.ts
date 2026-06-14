import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkAvailability = async (itemId: number, startDate: Date, endDate: Date) => {
  // Check if there are any active or pending rentals overlapping with this period
  const overlappingRentals = await prisma.rental.findMany({
    where: {
      itemId,
      status: {
        in: ['PENDING', 'ACTIVE']
      },
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } }
      ]
    }
  });

  return overlappingRentals.length === 0;
};
