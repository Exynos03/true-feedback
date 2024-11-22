import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Database is already connected");
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables.");
        throw new Error("MONGODB_URI is required to connect to the database.");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {});

        connection.isConnected = db.connection.readyState; // Correctly accessing readyState

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error; // Throw the error instead of exiting the process
    }
};

export default dbConnect;
