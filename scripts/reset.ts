import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
//@ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("REMOVE database");
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeProgess);
    await db.delete(schema.challengesOptions);
    await db.delete(schema.userSubscription);
    console.log("RUN PROCESS");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
