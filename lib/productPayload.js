import { slugify } from "@/lib/slugify";

const CATEGORIES = ["For Him", "For Her", "Unisex", "Attar/Oud"];

function asString(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function parseNotesList(value) {
  return asString(value)
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "on" || value === "1") return true;
  if (value === "false" || value === "0" || value === "") return false;
  return fallback;
}

/**
 * Parse + validate product fields from a FormData (create/edit) or a plain
 * object. Returns `{ data }` on success or `{ errors }` on failure.
 */
export function parseProductPayload(input, { partial = false } = {}) {
  const get = (key) => {
    if (typeof input.get === "function") {
      return input.get(key);
    }
    return input[key];
  };

  const name = asString(get("name"));
  const slug = slugify(asString(get("slug")) || name);
  const short_description = asString(get("short_description"));
  const description = asString(get("description"));
  const category = asString(get("category"));
  const currency = asString(get("currency")) || "PKR";
  const priceRaw = get("price");
  const volumeRaw = get("volume_ml");
  const price = Number(priceRaw);
  const volume_ml = Number(volumeRaw);

  const errors = {};

  if (!partial || get("name") != null) {
    if (!name) errors.name = "Name is required.";
  }
  if (!partial || get("slug") != null || get("name") != null) {
    if (!slug) errors.slug = "Slug is required.";
  }
  if (!partial || get("short_description") != null) {
    if (!short_description) {
      errors.short_description = "Short description is required.";
    }
  }
  if (!partial || get("description") != null) {
    if (!description) errors.description = "Description is required.";
  }
  if (!partial || get("category") != null) {
    if (!CATEGORIES.includes(category)) {
      errors.category = "Pick a valid category.";
    }
  }
  if (!partial || get("price") != null) {
    if (!Number.isFinite(price) || price < 0) {
      errors.price = "Enter a valid price.";
    }
  }
  if (!partial || get("volume_ml") != null) {
    if (!Number.isFinite(volume_ml) || volume_ml <= 0) {
      errors.volume_ml = "Enter a valid volume in ml.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const data = {
    name,
    slug,
    short_description,
    description,
    price,
    currency,
    category,
    volume_ml,
    in_stock: parseBoolean(get("in_stock"), true),
    featured: parseBoolean(get("featured"), false),
    notes: {
      top: parseNotesList(get("notes_top")),
      middle: parseNotesList(get("notes_middle")),
      base: parseNotesList(get("notes_base")),
    },
  };

  return { data };
}

export const PRODUCT_CATEGORIES = CATEGORIES;
