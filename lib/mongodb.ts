import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// Module-level connection cache stored on the global object so it survives
// Next.js hot-reload in development without leaking connections.
// ---------------------------------------------------------------------------
let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  // Strictly rely on MONGODB_URI – works for both MongoDB Atlas URIs and raw
  // local/Kubernetes URIs like mongodb://mongo-service:27017/framerate
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable is not set. ' +
      'Define it in your .env file or as a Kubernetes Secret/ConfigMap.'
    );
  }

  // Return the already-established connection immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise only once; subsequent callers wait for it.
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // Fail fast so Kubernetes probes surface issues quickly.
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m)
      .catch((err) => {
        // Reset so the next invocation can retry instead of re-throwing a
        // stale rejected promise.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
