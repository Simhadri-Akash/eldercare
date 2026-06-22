import { Router, type Request, type Response } from "express";
import { collection, normalizeDocument, parseObjectId } from "../lib/mongo";
import type { ObjectId } from "@workspace/db";
import { CreateMessageBody } from "@workspace/api-zod";
import { parseBody, requireObjectId } from "../lib/http";

export type Message = {
  _id?: ObjectId;
  senderId: string;
  recipientId: string;
  subject?: string;
  text: string;
  sentAt: Date;
  read: boolean;
};

export type MessageCreate = Omit<Message, "_id" | "sentAt" | "read">;

const router = Router();

router.get("/messages", async (_req, res) => {
  const coll = await collection<Message>("messages");
  const items = await coll.find().sort({ sentAt: -1 }).toArray();
  res.json(items.map(normalizeDocument));
});

router.post("/messages", async (req, res) => {
  const payload = parseBody(CreateMessageBody, req) as MessageCreate;
  const message: Message = {
    ...payload,
    sentAt: new Date(),
    read: false,
  };

  const coll = await collection<Message>("messages");
  const result = await coll.insertOne(message);
  res.status(201).json({ id: result.insertedId.toHexString(), ...message });
});

router.patch("/messages/:id/read", async (req, res) => {
  const id = requireObjectId(req.params.id, "message");

  const coll = await collection<Message>("messages");
  const updated = await coll.findOneAndUpdate(
    { _id: id },
    { $set: { read: true } },
    { returnDocument: "after" },
  );

  if (!updated) return res.status(404).json({ error: "Message not found" });
  return res.json(normalizeDocument(updated));
});

export default router;
