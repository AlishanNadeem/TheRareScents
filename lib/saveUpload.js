import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Persist an uploaded File under /public/uploads and return the public path
 * (e.g. "/uploads/abc123.jpg").
 *
 * NOTE: Storing uploads in /public/uploads is fine for local development, but
 * this should move to a cloud storage service like Cloudinary (or S3) before
 * production — /public/uploads will not persist on most serverless hosts
 * (Vercel, etc.) across deploys or between instances.
 */
export async function saveUpload(file) {
  if (!file || typeof file === "string" || !file.size) {
    return null;
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Each image must be 5 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
}
