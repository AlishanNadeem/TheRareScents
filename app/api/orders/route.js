import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { checkRateLimit } from "@/lib/rateLimit";
import { isValidPakistaniPhone } from "@/lib/validation";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  // Strip control characters and cap length — this isn't rendered as HTML
  // anywhere today, so this is about keeping the DB clean, not escaping XSS.
  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizeQuantity(value) {
  const num = Number.parseInt(value, 10);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.min(num, 20);
}

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request) {
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(`orders:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((retryAfterMs ?? 0) / 1000)),
        },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot: real users never see or focus this field (it's visually
  // hidden and unreachable by keyboard in OrderForm). Bots that auto-fill
  // every input will trip it, so we reject the submission outright.
  if (sanitizeText(body.company)) {
    return NextResponse.json(
      { ok: false, error: "Submission rejected." },
      { status: 400 }
    );
  }

  const customer_name = sanitizeText(body.name, 120);
  const phone = sanitizeText(body.phone, 30);
  const address = sanitizeText(body.address, 500);
  const message = sanitizeText(body.message, 1000);
  const quantity = sanitizeQuantity(body.quantity);

  const errors = {};
  if (!customer_name) {
    errors.name = "Please enter your full name.";
  }
  if (!phone) {
    errors.phone = "Please enter your phone number.";
  } else if (!isValidPakistaniPhone(phone)) {
    errors.phone = "Enter a valid Pakistani mobile number, e.g. 03001234567.";
  }
  if (!address) {
    errors.address = "Please enter your full shipping address.";
  } else if (address.length < 10) {
    errors.address =
      "Please include house/street, area, and city so we can deliver.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const productSlug = sanitizeText(body.product_slug, 200);
  const productName = sanitizeText(body.product_name, 200) || "General Inquiry";
  const productId =
    typeof body.product_id === "string" && OBJECT_ID_RE.test(body.product_id)
      ? body.product_id
      : undefined;
  const productPrice = Number.isFinite(Number(body.product_price))
    ? Number(body.product_price)
    : 0;

  try {
    await connectToDatabase();

    const order = await Order.create({
      customer_name,
      phone,
      address,
      city: "",
      quantity,
      message,
      status: "NEW",
      items: productSlug
        ? [
            {
              product_id: productId,
              product_name: productName,
              product_slug: productSlug,
              price: productPrice,
              quantity,
            },
          ]
        : [],
    });

    return NextResponse.json({ ok: true, id: order._id.toString() });
  } catch (error) {
    console.error("[api/orders] failed to save order:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
