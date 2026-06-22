import { Router, type Request, type Response } from "express";
import { collection, normalizeDocument, parseObjectId } from "../lib/mongo";
import type { ObjectId } from "@workspace/db";
import { CreateAppointmentBody, UpdateAppointmentBody } from "@workspace/api-zod";
import { parseBody, requireObjectId } from "../lib/http";

export type Appointment = {
  _id?: ObjectId;
  clientName: string;
  service: string;
  date: string;
  time: string;
  location?: string;
  caregiverId?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentCreate = Omit<Appointment, "_id" | "createdAt" | "updatedAt">;

const router = Router();

router.get("/appointments", async (_req: Request, res: Response) => {
  const coll = await collection<Appointment>("appointments");
  const items = await coll.find().sort({ date: 1, time: 1 }).toArray();
  res.json(items.map(normalizeDocument));
});

router.post("/appointments", async (req: Request, res: Response) => {
  const parsed = parseBody(CreateAppointmentBody, req);
  const payload: AppointmentCreate = {
    ...parsed,
    date: parsed.date.toISOString().slice(0, 10),
    status: parsed.status ?? "Scheduled",
  };
  const now = new Date();

  const appointment: Appointment = {
    ...payload,
    status: payload.status ?? "Scheduled",
    createdAt: now,
    updatedAt: now,
  };

  const coll = await collection<Appointment>("appointments");
  const result = await coll.insertOne(appointment);

  res.status(201).json({ id: result.insertedId.toHexString(), ...appointment });
});

router.put("/appointments/:id", async (req: Request, res: Response) => {
  const id = requireObjectId(req.params.id, "appointment");
  const parsed = parseBody(UpdateAppointmentBody, req);
  const { date, ...fields } = parsed;
  const updates: Partial<Appointment> = {
    ...fields,
    ...(date ? { date: date.toISOString().slice(0, 10) } : {}),
    updatedAt: new Date(),
  };

  const coll = await collection<Appointment>("appointments");
  const updated = await coll.findOneAndUpdate(
    { _id: id },
    { $set: updates },
    { returnDocument: "after" },
  );

  if (!updated) return res.status(404).json({ error: "Appointment not found" });

  return res.json(normalizeDocument(updated));
});

router.delete("/appointments/:id", async (req: Request, res: Response) => {
  const id = requireObjectId(req.params.id, "appointment");

  const coll = await collection<Appointment>("appointments");
  const result = await coll.deleteOne({ _id: id });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Appointment not found" });

  return res.status(204).send();
});

export default router;
