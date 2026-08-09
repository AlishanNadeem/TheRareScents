import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";
import { ORDER_STATUSES } from "@/lib/orderConstants";
import { serializeOrder } from "@/lib/ordersAdmin";
import { revalidatePath } from "next/cache";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

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
      { ok: false, error: "Invalid order id." },
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

  const status = typeof body.status === "string" ? body.status.trim() : "";
  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Invalid status." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order not found." },
        { status: 404 }
      );
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return NextResponse.json({ ok: true, order: serializeOrder(order) });
  } catch (error) {
    console.error("[api/admin/orders] patch failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update order." },
      { status: 500 }
    );
  }
}
