const mongoose = require("mongoose");

const { Schema } = mongoose;

// Snapshot of what was ordered, embedded on the order itself so historical
// orders stay accurate even if a product's price/name changes later.
const orderItemSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    product_name: { type: String, default: "" },
    product_slug: { type: String, default: "" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customer_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // Legacy field — kept so older orders still load. New submissions use
    // `address` only; `city` is no longer collected on the storefront.
    city: { type: String, default: "", trim: true },
    // Required by /api/orders for new submissions. Not schema-required so
    // legacy orders without this field still load and update cleanly.
    address: { type: String, default: "", trim: true },
    quantity: { type: Number, default: 1, min: 1 },
    message: { type: String, default: "" },
    items: { type: [orderItemSchema], default: [] },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONFIRMED", "FULFILLED", "CANCELLED"],
      default: "NEW",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
