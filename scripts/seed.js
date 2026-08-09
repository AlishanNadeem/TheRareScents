// Seeds MongoDB Atlas with the same products that used to live in
// /data/products.js, so the database starts with identical content to the
// old mock data. Run with: npm run seed
//
// This is a plain Node script (not bundled by Next.js), so it loads
// .env.local itself and requires the Mongoose model directly.

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const Product = require("../models/Product");

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "Missing MONGODB_URI. Copy .env.example to .env.local and fill in your MongoDB Atlas connection string."
    );
    process.exit(1);
  }

  // data/products.js is still an ES module (export default / named exports),
  // so it's loaded via dynamic import rather than require().
  const { default: products } = await import("../data/products.js");

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri);

  console.log("Clearing existing products...");
  await Product.deleteMany({});

  // Drop the mock string _id ("1", "2", ...) and let MongoDB generate real
  // ObjectIds instead.
  const docs = products.map(({ _id, ...rest }) => rest);

  const inserted = await Product.insertMany(docs);
  console.log(`Seeded ${inserted.length} products into MongoDB Atlas.`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
