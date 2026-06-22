import { Router, type Request, type Response } from "express";
import { collection, normalizeDocument, parseObjectId } from "../lib/mongo";
import type { ObjectId } from "@workspace/db";
import { CreateNotificationBody } from "@workspace/api-zod";
import { parseBody, requireObjectId } from "../lib/http";

export type Notification = {
  _id?: ObjectId;
  title: string;
  body: string;
  category: "alert" | "reminder" | "update" | "info";
  createdAt: Date;
  read: boolean;
};

export type NotificationCreate = Omit<Notification, "_id" | "createdAt" | "read">;

const router = Router();

router.get("/notifications", async (_req: Request, res: Response) => {
  const coll = await collection<Notification>("notifications");
  const items = await coll.find().sort({ createdAt: -1 }).toArray();
  res.json(items.map(normalizeDocument));
});

router.post("/notifications", async (req: Request, res: Response) => {
  const payload = parseBody(CreateNotificationBody, req) as NotificationCreate;
  const notification: Notification = {
    ...payload,
    createdAt: new Date(),
    read: false,
  };

  const coll = await collection<Notification>("notifications");
  const result = await coll.insertOne(notification);
  res.status(201).json({ id: result.insertedId.toHexString(), ...notification });
});

router.patch("/notifications/:id/read", async (req: Request, res: Response) => {
  const id = requireObjectId(req.params.id, "notification");

  const coll = await collection<Notification>("notifications");
  const updated = await coll.findOneAndUpdate(
    { _id: id },
    { $set: { read: true } },
    { returnDocument: "after" },
  );

  if (!updated) return res.status(404).json({ error: "Notification not found" });
  return res.json(normalizeDocument(updated));
});

export default router;
