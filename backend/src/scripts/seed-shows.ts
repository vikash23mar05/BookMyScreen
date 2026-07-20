import mongoose from "mongoose";
import { config } from "../config/config";
import { reseedShows } from "../modules/show/show.seeder";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

// Manual reseed: covers a rolling 7-day window starting today,
// matching the frontend date selector. Reuses the shared seeder so
// the standalone script and the server-startup self-heal never drift.
mongoose
  .connect(config.databaseReplicaSet as string, {
    family: 4,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log("DB connected");
    await reseedShows(7);
    await mongoose.disconnect();
    console.log("✅ Show seeding completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Show seeding failed:", err);
    process.exit(1);
  });
