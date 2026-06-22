import { Router } from "express";
import { pingDatabase } from "@workspace/db";

const router = Router();

router.get("/status", async (_req, res) => {
  try {
    await pingDatabase();
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(500).json({
      status: "error",
      message: "Unable to connect to database",
    });
  }
});

export default router;
