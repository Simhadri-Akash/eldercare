import { Router } from "express";
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { z } from "zod";
import { collection, normalizeDocument } from "../lib/mongo";
import { HttpError, parseBody } from "../lib/http";
import type { ObjectId } from "@workspace/db";

type UserDocument = {
  _id?: ObjectId;
  name: string;
  email: string;
  role: "family" | "caregiver" | "admin";
  passwordHash: string;
  createdAt: Date;
};

const scrypt = promisify(scryptCallback);
const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
  role: z.enum(["family", "caregiver"]).default("family"),
});
const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

const router = Router();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scrypt(password, Buffer.from(saltHex, "hex"), expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function createToken(user: UserDocument & { _id: ObjectId }): string {
  const payload = Buffer.from(JSON.stringify({
    sub: user._id.toHexString(),
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString("base64url");
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required in production");
  }
  const secret = process.env.AUTH_SECRET ?? "development-only-change-me";
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function publicUser(user: UserDocument & { _id: ObjectId }) {
  const { passwordHash: _passwordHash, ...safe } = normalizeDocument(user);
  return safe;
}

router.post("/auth/signup", async (req, res) => {
  const payload = parseBody(signupSchema, req);
  const users = await collection<UserDocument>("users");
  const existing = await users.findOne({ email: payload.email });
  if (existing) throw new HttpError(409, "An account with this email already exists");

  const user: UserDocument = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    passwordHash: await hashPassword(payload.password),
    createdAt: new Date(),
  };
  const result = await users.insertOne(user);
  const saved = { ...user, _id: result.insertedId };
  res.status(201).json({ user: publicUser(saved), token: createToken(saved) });
});

router.post("/auth/login", async (req, res) => {
  const payload = parseBody(loginSchema, req);
  const users = await collection<UserDocument>("users");
  const user = await users.findOne({ email: payload.email });
  if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  res.json({ user: publicUser(user), token: createToken(user) });
});

export default router;
