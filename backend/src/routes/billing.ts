import { Router, type Request, type Response } from "express";
import { collection, normalizeDocument, parseObjectId } from "../lib/mongo";
import type { ObjectId } from "@workspace/db";
import { CreateInvoiceBody } from "@workspace/api-zod";
import { parseBody, requireObjectId } from "../lib/http";

export type Invoice = {
  _id?: ObjectId;
  invoiceId: string;
  date: string;
  dueDate: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  clientName?: string;
  createdAt: Date;
};

export type InvoiceCreate = Omit<Invoice, "_id" | "createdAt">;

const router = Router();

router.get("/billing/invoices", async (_req: Request, res: Response) => {
  const coll = await collection<Invoice>("invoices");
  const items = await coll.find().sort({ date: -1 }).toArray();
  res.json(items.map(normalizeDocument));
});

router.post("/billing/invoices", async (req: Request, res: Response) => {
  const payload = parseBody(CreateInvoiceBody, req) as InvoiceCreate;
  const invoice: Invoice = {
    ...payload,
    createdAt: new Date(),
  };

  const coll = await collection<Invoice>("invoices");
  const result = await coll.insertOne(invoice);
  res.status(201).json({ id: result.insertedId.toHexString(), ...invoice });
});

router.post("/billing/invoices/:id/pay", async (req: Request, res: Response) => {
  const id = requireObjectId(req.params.id, "invoice");

  const coll = await collection<Invoice>("invoices");
  const updated = await coll.findOneAndUpdate(
    { _id: id },
    { $set: { status: "Paid" } },
    { returnDocument: "after" },
  );

  if (!updated) return res.status(404).json({ error: "Invoice not found" });
  return res.json(normalizeDocument(updated));
});

export default router;
