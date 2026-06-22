import { Router, type Request, type Response } from "express";
import { collection, normalizeDocument, parseObjectId } from "../lib/mongo";
import type { ObjectId } from "@workspace/db";
import { CreateCareTeamMemberBody, UpdateCareTeamMemberBody } from "@workspace/api-zod";
import { parseBody, requireObjectId } from "../lib/http";

export type CareTeamMember = {
  _id?: ObjectId;
  name: string;
  role: string;
  status: string;
  specialties: string[];
  rating: number;
  bio?: string;
  avatarUrl?: string;
  isPrimary: boolean;
  updatedAt: Date;
};

export type CareTeamMemberCreate = Omit<CareTeamMember, "_id" | "updatedAt">;

const router = Router();

router.get("/care-team", async (_req: Request, res: Response) => {
  const coll = await collection<CareTeamMember>("careTeam");
  const items = await coll.find().sort({ name: 1 }).toArray();
  res.json(items.map(normalizeDocument));
});

router.post("/care-team", async (req: Request, res: Response) => {
  const payload = parseBody(CreateCareTeamMemberBody, req) as CareTeamMemberCreate;
  const member: CareTeamMember = {
    ...payload,
    updatedAt: new Date(),
  };

  const coll = await collection<CareTeamMember>("careTeam");
  const result = await coll.insertOne(member);
  res.status(201).json({ id: result.insertedId.toHexString(), ...member });
});

router.put("/care-team/:id", async (req: Request, res: Response) => {
  const id = requireObjectId(req.params.id, "team member");
  const updates = { ...parseBody(UpdateCareTeamMemberBody, req), updatedAt: new Date() };

  const coll = await collection<CareTeamMember>("careTeam");
  const updated = await coll.findOneAndUpdate(
    { _id: id },
    { $set: updates },
    { returnDocument: "after" },
  );

  if (!updated) return res.status(404).json({ error: "Team member not found" });
  return res.json(normalizeDocument(updated));
});

router.delete("/care-team/:id", async (req: Request, res: Response) => {
  const id = requireObjectId(req.params.id, "team member");

  const coll = await collection<CareTeamMember>("careTeam");
  const result = await coll.deleteOne({ _id: id });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Team member not found" });

  return res.status(204).send();
});

export default router;
