import type { Request } from "express";
import { ObjectId } from "@workspace/db";

type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: unknown } };

type Schema<T> = { safeParse(value: unknown): ParseResult<T> };

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export function parseBody<T>(schema: Schema<T>, req: Request): T {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw new HttpError(400, "Invalid request body", result.error.issues);
  }
  return result.data;
}

export function requireObjectId(
  value: string | string[] | undefined,
  resource: string,
): ObjectId {
  const normalized = Array.isArray(value) ? value[0] : value;
  if (!normalized || !ObjectId.isValid(normalized)) {
    throw new HttpError(400, `Invalid ${resource} id`);
  }
  return new ObjectId(normalized);
}
