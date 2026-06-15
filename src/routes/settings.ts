import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateJWT } from "./auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/settings - Publicly accessible
router.get("/", async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array of {key, value} to an object {key: value}
    const settingsObj = settings.reduce((acc, current) => {
      acc[current.key] = current.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.json(settingsObj);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// PUT /api/settings - Admin only
router.put("/", authenticateJWT, async (req: any, res: any) => {
  try {
    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admins can update settings" });
    }

    const updates = req.body; // e.g. { footerText: "© 2026 ... sinkdev.dev" }
    
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const promises = Object.entries(updates).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await Promise.all(promises);

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Failed to update settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
