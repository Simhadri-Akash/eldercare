import { Router, type Request, type Response } from "express";
import { collection, normalizeDocument } from "../lib/mongo";
import type { ObjectId } from "@workspace/db";
import { CreateHealthReportBody } from "@workspace/api-zod";
import { parseBody } from "../lib/http";

export type HealthReport = {
  _id?: ObjectId;
  type: string;
  value: string;
  status: string;
  date: string;
  notes?: string;
  createdAt: Date;
};

export type HealthReportCreate = Omit<HealthReport, "_id" | "createdAt">;

const router = Router();

router.get("/health-reports", async (_req: Request, res: Response) => {
  const coll = await collection<HealthReport>("healthReports");
  const items = await coll.find().sort({ date: -1 }).toArray();
  res.json(items.map(normalizeDocument));
});

router.post("/health-reports", async (req: Request, res: Response) => {
  const payload = parseBody(CreateHealthReportBody, req) as HealthReportCreate;
  const report: HealthReport = {
    ...payload,
    createdAt: new Date(),
  };

  const coll = await collection<HealthReport>("healthReports");
  const result = await coll.insertOne(report);
  res.status(201).json({ id: result.insertedId.toHexString(), ...report });
});

export default router;
