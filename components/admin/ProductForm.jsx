"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { PRODUCT_CATEGORIES } from "@/lib/productPayload";

function notesToString(notes) {
  return Array.isArray(notes) ? notes.join(", ") : "";
}

function toDatetimeLocalValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function inputClass(hasError) {
  return `mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
      : "border-neutral-300 focus:border-gold focus:ring-gold"
  }`;
}

export default function ProductForm({ product = null }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [shortDescription, setShortDescription] = useState(
    product?.short_description ?? ""
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [category, setCategory] = useState(product?.category ?? "Unisex");
  const [volumeMl, setVolumeMl] = useState(product?.volume_ml ?? 50);
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [onSale, setOnSale] = useState(product?.on_sale ?? false);
  const [discountPercent, setDiscountPercent] = useState(
    product?.discount_percent ?? ""
  );
  const [saleLabel, setSaleLabel] = useState(product?.sale_label ?? "");
  const [saleEndsAt, setSaleEndsAt] = useState(
    toDatetimeLocalValue(product?.sale_ends_at)
  );
  const [notesTop, setNotesTop] = useState(notesToString(product?.notes?.top));
  const [notesMiddle, setNotesMiddle] = useState(
    notesToString(product?.notes?.middle)
  );
  const [notesBase, setNotesBase] = useState(
    notesToString(product?.notes?.base)
  );
  const [existingImages, setExistingImages] = useState(product?.images ?? []);
  const [newFiles, setNewFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const newPreviews = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles]
  );

  function handleNameChange(value) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleFilesChange(event) {
    const files = Array.from(event.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  }

  function removeNewFile(index) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(src) {
    setExistingImages((prev) => prev.filter((image) => image !== src));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setErrors({});
    setSaving(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("short_description", shortDescription);
    formData.set("description", description);
    formData.set("price", String(price));
    formData.set("category", category);
    formData.set("volume_ml", String(volumeMl));
    formData.set("in_stock", String(inStock));
    formData.set("featured", String(featured));
    formData.set("on_sale", String(onSale));
    formData.set("discount_percent", String(discountPercent));
    formData.set("sale_label", saleLabel);
    formData.set("sale_ends_at", saleEndsAt);
    formData.set("notes_top", notesTop);
    formData.set("notes_middle", notesMiddle);
    formData.set("notes_base", notesBase);
    formData.set("currency", "PKR");

    existingImages.forEach((src) => formData.append("existing_images", src));
    newFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(
        isEdit ? `/api/admin/products/${product._id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setSubmitError(data.error || "Could not save product.");
        setSaving(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setSubmitError("Could not save product. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-neutral-800"
          >
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            className={inputClass(Boolean(errors.name))}
            required
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="slug"
            className="text-sm font-medium text-neutral-800"
          >
            Slug
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            className={inputClass(Boolean(errors.slug))}
            required
          />
          <p className="mt-1 text-xs text-neutral-500">
            Auto-generated from the name — edit if you need a custom URL.
          </p>
          {errors.slug && (
            <p className="mt-1 text-xs text-red-600">{errors.slug}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="short_description"
            className="text-sm font-medium text-neutral-800"
          >
            Short description
          </label>
          <input
            id="short_description"
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            className={inputClass(Boolean(errors.short_description))}
            required
          />
          {errors.short_description && (
            <p className="mt-1 text-xs text-red-600">
              {errors.short_description}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-neutral-800"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass(Boolean(errors.description))}
            required
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="text-sm font-medium text-neutral-800"
          >
            Price (PKR)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass(Boolean(errors.price))}
            required
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="volume_ml"
            className="text-sm font-medium text-neutral-800"
          >
            Volume (ml)
          </label>
          <input
            id="volume_ml"
            type="number"
            min="1"
            value={volumeMl}
            onChange={(event) => setVolumeMl(event.target.value)}
            className={inputClass(Boolean(errors.volume_ml))}
            required
          />
          {errors.volume_ml && (
            <p className="mt-1 text-xs text-red-600">{errors.volume_ml}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-medium text-neutral-800"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass(Boolean(errors.category))}
          >
            {PRODUCT_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="notes_top"
            className="text-sm font-medium text-neutral-800"
          >
            Top notes
          </label>
          <input
            id="notes_top"
            value={notesTop}
            onChange={(event) => setNotesTop(event.target.value)}
            placeholder="Saffron, Bergamot"
            className={inputClass(false)}
          />
          <p className="mt-1 text-xs text-neutral-500">Comma-separated</p>
        </div>
        <div>
          <label
            htmlFor="notes_middle"
            className="text-sm font-medium text-neutral-800"
          >
            Middle notes
          </label>
          <input
            id="notes_middle"
            value={notesMiddle}
            onChange={(event) => setNotesMiddle(event.target.value)}
            placeholder="Rose, Amber"
            className={inputClass(false)}
          />
        </div>
        <div>
          <label
            htmlFor="notes_base"
            className="text-sm font-medium text-neutral-800"
          >
            Base notes
          </label>
          <input
            id="notes_base"
            value={notesBase}
            onChange={(event) => setNotesBase(event.target.value)}
            placeholder="Musk, Vanilla"
            className={inputClass(false)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) => setInStock(event.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-gold focus:ring-gold"
          />
          In stock
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-gold focus:ring-gold"
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(event) => setOnSale(event.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-gold focus:ring-gold"
          />
          On Sale
        </label>
      </div>

      {onSale && (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-gold/30 bg-gold/5 p-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="discount_percent"
              className="text-sm font-medium text-neutral-800"
            >
              Discount %
            </label>
            <input
              id="discount_percent"
              type="number"
              min="1"
              max="100"
              step="1"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(event.target.value)}
              className={inputClass(Boolean(errors.discount_percent))}
              required={onSale}
            />
            {errors.discount_percent && (
              <p className="mt-1 text-xs text-red-600">
                {errors.discount_percent}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="sale_label"
              className="text-sm font-medium text-neutral-800"
            >
              Sale Label
            </label>
            <input
              id="sale_label"
              type="text"
              value={saleLabel}
              onChange={(event) => setSaleLabel(event.target.value)}
              placeholder="e.g. Azaadi Sale"
              className={inputClass(false)}
            />
          </div>
          <div>
            <label
              htmlFor="sale_ends_at"
              className="text-sm font-medium text-neutral-800"
            >
              Sale Ends At
            </label>
            <input
              id="sale_ends_at"
              type="datetime-local"
              value={saleEndsAt}
              onChange={(event) => setSaleEndsAt(event.target.value)}
              className={inputClass(Boolean(errors.sale_ends_at))}
            />
            {errors.sale_ends_at && (
              <p className="mt-1 text-xs text-red-600">{errors.sale_ends_at}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Optional — sale hides automatically after this time.
            </p>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="images"
          className="text-sm font-medium text-neutral-800"
        >
          Images
        </label>
        <input
          id="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
          className="mt-1 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-paper hover:file:opacity-90"
        />
        <p className="mt-1 text-xs text-neutral-500">
          JPG, PNG, or WebP — up to 5 MB each.
        </p>

        {(existingImages.length > 0 || newPreviews.length > 0) && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {existingImages.map((src) => (
              <li
                key={src}
                className="relative aspect-square overflow-hidden rounded-lg border border-ink/10 bg-neutral-100"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(src)}
                  className="absolute right-1 top-1 rounded bg-ink/80 px-2 py-0.5 text-xs text-paper"
                >
                  Remove
                </button>
              </li>
            ))}
            {newPreviews.map((preview, index) => (
              <li
                key={preview.url}
                className="relative aspect-square overflow-hidden rounded-lg border border-ink/10 bg-neutral-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  className="absolute right-1 top-1 rounded bg-ink/80 px-2 py-0.5 text-xs text-paper"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-ink/20 px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
