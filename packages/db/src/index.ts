import { MongoClient, ObjectId, type Collection, type Db, type Document } from "mongodb";

export { ObjectId } from "mongodb";
export type { Document } from "mongodb";

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

function getConnectionString(): string {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error(
      "MONGODB_URI is required (for example mongodb://127.0.0.1:27017/care_engine).",
    );
  }
  return connectionString;
}

export function connectDatabase(): Promise<MongoClient> {
  if (!clientPromise) {
    client = new MongoClient(getConnectionString(), {
      appName: "befine-care-engine",
      serverSelectionTimeoutMS: 10_000,
    });
    clientPromise = client.connect().catch((error) => {
      client = undefined;
      clientPromise = undefined;
      throw error;
    });
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const mongoClient = await connectDatabase();
  return mongoClient.db(process.env.MONGODB_DB || undefined);
}

export async function getCollection<TSchema extends Document = Document>(name: string): Promise<Collection<TSchema>> {
  const db = await getDb();
  return db.collection<TSchema>(name);
}

export async function pingDatabase() {
  const db = await getDb();
  await db.command({ ping: 1 });
  return { status: "connected" };
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();
  await Promise.all([
    db.collection("appointments").createIndex({ date: 1, time: 1 }),
    db.collection("messages").createIndex({ sentAt: -1 }),
    db.collection("notifications").createIndex({ createdAt: -1 }),
    db.collection("careTeam").createIndex({ name: 1 }),
    db.collection("invoices").createIndex({ invoiceId: 1 }, { unique: true }),
    db.collection("healthReports").createIndex({ date: -1 }),
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
  ]);
}

export async function closeDatabase(): Promise<void> {
  if (!client) return;
  await client.close();
  client = undefined;
  clientPromise = undefined;
}

export * from "./schema";
