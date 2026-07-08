import mongoose from "mongoose";
import { config } from "./config";
import dns from "dns";

dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
    try {
        await mongoose.connect(config.databaseReplicaSet as string, {
            family: 4,
            tlsAllowInvalidCertificates: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to database");
    } catch (error) {
        console.log("Failed to connect to database", error);
        process.exit(1);
    }
};

export default connectDB;