import Link from "next/link";
import { notFound } from "next/navigation";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import PhoneActions from "@/components/admin/PhoneActions";
import { ORDER_STATUS_LABELS } from "@/lib/orderConstants";
import { formatOrderDateTime, getOrderById } from "@/lib/ordersAdmin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Detail",
};

export default async function AdminOrderDetailPage({ params }) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-sm text-neutral-500 hover:text-ink"
        >
          ← Back to orders
        </Link>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-ink">
              Order from {order.customer_name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Placed {formatOrderDateTime(order.created_at)} ·{" "}
              {ORDER_STATUS_LABELS[order.status] || order.status}
            </p>
          </div>
          <OrderStatusSelect
            orderId={order._id}
            value={order.status}
            size="md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-ink/10 bg-white p-6 lg:col-span-1">
          <h2 className="font-display text-lg text-ink">Customer</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd className="mt-1 font-medium text-ink">
                {order.customer_name}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd className="mt-1">
                <PhoneActions
                  phone={order.phone}
                  customerName={order.customer_name}
                  address={order.address}
                />
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Shipping Address</dt>
              <dd className="mt-1 whitespace-pre-wrap text-ink">
                {order.address || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Quantity requested</dt>
              <dd className="mt-1 text-ink">{order.quantity}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Last updated</dt>
              <dd className="mt-1 text-ink">
                {formatOrderDateTime(order.updated_at)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-ink/10 bg-white p-6 lg:col-span-2">
          <h2 className="font-display text-lg text-ink">Items</h2>

          {order.items.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              General inquiry — no specific product attached.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-neutral-500">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr
                      key={`${item.product_slug || item.product_name}-${index}`}
                      className="border-b border-ink/5"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium text-ink">
                          {item.product_name || "Product"}
                        </p>
                        {item.product_slug && (
                          <Link
                            href={`/products/${item.product_slug}`}
                            className="text-xs text-neutral-500 hover:text-ink"
                            target="_blank"
                          >
                            View on storefront
                          </Link>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 pr-4 text-neutral-600">
                        Rs {Number(item.price).toLocaleString("en-PK")}
                      </td>
                      <td className="py-3 text-neutral-800">
                        Rs{" "}
                        {(
                          Number(item.price) * Number(item.quantity || 1)
                        ).toLocaleString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-medium">
                      Total
                    </td>
                    <td className="pt-4 font-semibold text-ink">
                      Rs {itemsTotal.toLocaleString("en-PK")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="mt-8 border-t border-ink/10 pt-6">
            <h3 className="text-sm font-medium text-neutral-800">Message</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">
              {order.message?.trim() || "No message provided."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
