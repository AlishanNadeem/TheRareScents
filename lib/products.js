import { cache } from "react";
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

// React cache() dedupes identical calls within a single server request
// (e.g. generateMetadata + page both calling getProductBySlug).
export const getAllProducts = cache(async function getAllProducts() {
  try {
    await connectToDatabase();
    const docs = await Product.find().sort({ created_at: 1 }).lean();
    return docs.map(serializeProduct);
  } catch (error) {
    console.error("[products] getAllProducts: failed", error);
    throw error;
  }
});

export const getProductsByCategory = cache(
  async function getProductsByCategory(category) {
    try {
      await connectToDatabase();
      const docs = await Product.find({ category })
        .sort({ created_at: 1 })
        .lean();
      return docs.map(serializeProduct);
    } catch (error) {
      console.error("[products] getProductsByCategory: failed", {
        category,
        error,
      });
      throw error;
    }
  }
);

export const getFeaturedProducts = cache(async function getFeaturedProducts() {
  try {
    await connectToDatabase();
    const docs = await Product.find({ featured: true })
      .sort({ created_at: 1 })
      .lean();
    return docs.map(serializeProduct);
  } catch (error) {
    console.error("[products] getFeaturedProducts: failed", error);
    throw error;
  }
});

export const getProductBySlug = cache(async function getProductBySlug(slug) {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    await connectToDatabase();
    const doc = await Product.findOne({ slug }).lean();
    return serializeProduct(doc);
  } catch (error) {
    console.error("[products] getProductBySlug: failed", { slug, error });
    throw error;
  }
});

export async function getProductById(id) {
  if (!id || !/^[a-f0-9]{24}$/i.test(String(id))) {
    return null;
  }

  try {
    await connectToDatabase();
    const doc = await Product.findById(id).lean();
    return serializeProduct(doc);
  } catch (error) {
    console.error("[products] getProductById: failed", { id, error });
    throw error;
  }
}

export const getAllProductSlugs = cache(async function getAllProductSlugs() {
  try {
    await connectToDatabase();
    const docs = await Product.find().select("slug").lean();
    return docs.map((doc) => doc.slug).filter(Boolean);
  } catch (error) {
    console.error("[products] getAllProductSlugs: failed", error);
    throw error;
  }
});

// Sitemap entries with real updated_at — never invent timestamps.
export const getProductsForSitemap = cache(
  async function getProductsForSitemap() {
    try {
      await connectToDatabase();
      const docs = await Product.find().select("slug updated_at").lean();
      return docs
        .filter((doc) => doc?.slug)
        .map((doc) => ({
          slug: doc.slug,
          updated_at: doc.updated_at ? new Date(doc.updated_at) : undefined,
        }));
    } catch (error) {
      console.error("[products] getProductsForSitemap: failed", error);
      throw error;
    }
  }
);
