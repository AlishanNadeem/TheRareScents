const mongoose = require("mongoose");

const { Schema } = mongoose;

// Sub-document for fragrance notes — no own _id, since it's always accessed
// as a nested object (product.notes.top / .middle / .base), never queried
// or referenced independently.
const notesSchema = new Schema(
  {
    top: { type: [String], default: [] },
    middle: { type: [String], default: [] },
    base: { type: [String], default: [] },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "PKR" },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: ["For Him", "For Her", "Unisex", "Attar/Oud"],
    },
    notes: { type: notesSchema, default: () => ({}) },
    volume_ml: { type: Number, required: true, min: 0 },
    in_stock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    // Optional sale fields — products with on_sale false/unset display as usual.
    on_sale: { type: Boolean, default: false },
    discount_percent: { type: Number, min: 0, max: 100, default: null },
    sale_label: { type: String, trim: true, default: "" },
    // When set, sale display stops after this moment even if on_sale is still true.
    sale_ends_at: { type: Date, default: null },
  },
  {
    // created_at / updated_at (snake_case) instead of Mongoose's default
    // createdAt / updatedAt, to match the rest of the schema's naming.
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// `mongoose.models.Product ||` avoids "Cannot overwrite model once compiled"
// errors from Next.js's hot-reloading re-executing this module.
module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
