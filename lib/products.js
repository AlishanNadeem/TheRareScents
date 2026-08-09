import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

// Converts a lean Mongoose doc into a plain, JSON-serializable object (Server
// Components can't pass ObjectId/Date instances down to Client Components).
function serializeProduct(doc) {
  if (!doc) return null;

  const { __v, ...rest } = doc;

  return {
    ...rest,
    _id: rest._id.toString(),
    created_at: rest.created_at
      ? new Date(rest.created_at).toISOString()
      : undefined,
    updated_at: rest.updated_at
      ? new Date(rest.updated_at).toISOString()
      : undefined,
    sale_ends_at: rest.sale_ends_at
      ? new Date(rest.sale_ends_at).toISOString()
      : null,
  };
}

// Mirrors the function names/shapes that /data/products.js used to export,
// so pages and components only had to swap the import source, not their
// call sites or the markup they render.
export async function getAllProducts() {
  await connectToDatabase();
  const docs = await Product.find().sort({ created_at: 1 }).lean();
  return docs.map(serializeProduct);
}

export async function getFeaturedProducts() {
  await connectToDatabase();
  const docs = await Product.find({ featured: true })
    .sort({ created_at: 1 })
    .lean();
  return docs.map(serializeProduct);
}

export async function getProductBySlug(slug) {
  await connectToDatabase();
  const doc = await Product.findOne({ slug }).lean();
  return serializeProduct(doc);
}

export async function getProductById(id) {
  if (!id || !/^[a-f0-9]{24}$/i.test(String(id))) {
    return null;
  }

  await connectToDatabase();
  const doc = await Product.findById(id).lean();
  return serializeProduct(doc);
}

export async function getAllProductSlugs() {
  await connectToDatabase();
  const docs = await Product.find().select("slug").lean();
  return docs.map((doc) => doc.slug);
}
