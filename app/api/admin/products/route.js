import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import { parseProductPayload } from "@/lib/productPayload";
import { saveUpload } from "@/lib/saveUpload";
import { revalidateStorefront } from "@/lib/revalidateStorefront";

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
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
    const files = formData.getAll("images").filter((file) => file && file.size);
    const images = [];
    for (const file of files) {
      const path = await saveUpload(file);
      if (path) images.push(path);
    }

    await connectToDatabase();

    const existing = await Product.findOne({ slug: data.slug }).lean();
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          errors: { slug: "A product with this slug already exists." },
        },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...data,
      images,
    });

    revalidateStorefront(product.slug);

    return NextResponse.json({
      ok: true,
      product: { _id: product._id.toString(), slug: product.slug },
    });
  } catch (error) {
    console.error("[api/admin/products] create failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
