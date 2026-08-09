import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import { parseProductPayload } from "@/lib/productPayload";
import { saveUpload } from "@/lib/saveUpload";
import { revalidateStorefront } from "@/lib/revalidateStorefront";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

function isUploadPath(imagePath) {
  return typeof imagePath === "string" && imagePath.startsWith("/uploads/");
}

async function removeUploadFile(imagePath) {
  if (!isUploadPath(imagePath)) return;
  try {
    await unlink(path.join(process.cwd(), "public", imagePath));
  } catch {
    // File may already be gone — ignore.
  }
}

export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = params;
  if (!OBJECT_ID_RE.test(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid product id." },
      { status: 400 }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 }
    );
  }

  const { data, errors } = parseProductPayload(formData);
  if (errors) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Product not found." },
        { status: 404 }
      );
    }

    const previousSlug = product.slug;

    const slugTaken = await Product.findOne({
      slug: data.slug,
      _id: { $ne: id },
    }).lean();
    if (slugTaken) {
      return NextResponse.json(
        {
          ok: false,
          errors: { slug: "A product with this slug already exists." },
        },
        { status: 400 }
      );
    }

    // Kept images are sent as existing_images[] paths; new files as images[].
    let keepImages = formData
      .getAll("existing_images")
      .map((value) => String(value))
      .filter(Boolean);

    const removed = product.images.filter((img) => !keepImages.includes(img));
    await Promise.all(removed.map(removeUploadFile));

    const files = formData.getAll("images").filter((file) => file && file.size);
    for (const file of files) {
      const uploaded = await saveUpload(file);
      if (uploaded) keepImages.push(uploaded);
    }

    Object.assign(product, data, { images: keepImages });
    await product.save();

    revalidateStorefront(product.slug);
    if (previousSlug !== product.slug) {
      revalidateStorefront(previousSlug);
    }

    return NextResponse.json({
      ok: true,
      product: { _id: product._id.toString(), slug: product.slug },
    });
  } catch (error) {
    console.error("[api/admin/products] update failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = params;
  if (!OBJECT_ID_RE.test(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid product id." },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const update = {};
  if (typeof body.in_stock === "boolean") update.in_stock = body.in_stock;
  if (typeof body.featured === "boolean") update.featured = body.featured;

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nothing to update." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Product not found." },
        { status: 404 }
      );
    }

    revalidateStorefront(product.slug);

    return NextResponse.json({
      ok: true,
      product: {
        _id: product._id.toString(),
        in_stock: product.in_stock,
        featured: product.featured,
      },
    });
  } catch (error) {
    console.error("[api/admin/products] patch failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = params;
  if (!OBJECT_ID_RE.test(id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid product id." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Product not found." },
        { status: 404 }
      );
    }

    await Promise.all((product.images || []).map(removeUploadFile));
    revalidateStorefront(product.slug);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/products] delete failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
