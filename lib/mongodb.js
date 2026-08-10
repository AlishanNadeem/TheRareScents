const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

// Reused across hot reloads in dev and across serverless invocations in
// production so we never open a new connection per request. Stashed on the
// global object because Next.js clears the module cache on every reload but
// leaves globalThis intact within the same process.
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Add it to .env.local — see .env.example."
    );
  }

  if (!cached.promise) {
    console.log("[mongodb] opening new connection");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((instance) => {
        console.log("[mongodb] connected");
        return instance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("[mongodb] connection failed", error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

module.exports = connectToDatabase;
module.exports.connectToDatabase = connectToDatabase;
