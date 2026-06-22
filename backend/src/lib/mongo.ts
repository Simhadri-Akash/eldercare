import { ObjectId } from "@workspace/db";
import { getCollection } from "@workspace/db";
import type { Document } from "@workspace/db";

export function parseObjectId(value: string | string[] | undefined): ObjectId | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  if (!normalized || !ObjectId.isValid(normalized)) return null;
  return new ObjectId(normalized);
}

export function normalizeDocument<T extends { _id?: ObjectId }>(doc: T) {
  const { _id, ...data } = doc;
  return _id ? { id: _id.toHexString(), ...data } : data;
}

export async function collection<T extends Document = Document>(name: string) {
  return getCollection<T>(name);
}
