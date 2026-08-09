import Link from "next/link";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import PhoneActions from "@/components/admin/PhoneActions";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderConstants";
import {
  formatOrderDate,
  getOrdersPage,
  itemsSummary,
} from "@/lib/ordersAdmin";

export const dynamic = "force-dynamic";

function buildQuery({ status, sort, page }) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (sort && sort !== "desc") params.set("sort", sort);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default async function AdminOrdersPage({ searchParams }) {
  const status = searchParams?.status || "all";
  const sort = searchParams?.sort === "asc" ? "asc" : "desc";
  const page = Number.parseInt(searchParams?.page || "1", 10) || 1;

  const {
    orders,
    total,
    totalPages,
    page: currentPage,
  } = await getOrdersPage({
    status,
    sort,
    page,
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Orders</h1>
          <p className="mt-1 text-sm text-neutral-500">{total} total</p>
        </div>

        <form
          method="get"
          action="/admin/orders"
          className="flex flex-wrap items-center gap-3"
        >
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            Status
            <select
              name="status"
              defaultValue={status}
              className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm text-ink"
            >
              <option value="all">All</option>
              {ORDER_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {ORDER_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-neutral-600">
            Date
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm text-ink"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </label>

          <button
            type="submit"
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-paper transition hover:opacity-90"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/admin/orders${buildQuery({ status: "all", sort, page: 1 })}`}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            status === "all"
              ? "bg-ink text-paper"
              : "border border-ink/15 text-ink hover:bg-ink/5"
          }`}
        >
          All
        </Link>
        {ORDER_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/orders${buildQuery({ status: value, sort, page: 1 })}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              status === value
                ? "bg-ink text-paper"
                : "border border-ink/15 text-ink hover:bg-ink/5"
            }`}
          >
            {ORDER_STATUS_LABELS[value]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-neutral-500">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right"> </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-neutral-500"
                >
                  No orders match these filters.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-ink/5">
                <td className="px-4 py-3 font-medium text-ink">
                  {order.customer_name}
                </td>
                <td className="px-4 py-3">
                  <PhoneActions
                    phone={order.phone}
                    customerName={order.customer_name}
                  />
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {order.city || "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {itemsSummary(order)}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order._id} value={order.status} />
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {formatOrderDate(order.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink transition hover:bg-ink/5"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-neutral-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/orders${buildQuery({
                status,
                sort,
                page: Math.max(1, currentPage - 1),
              })}`}
              aria-disabled={currentPage <= 1}
              className={`rounded-full border border-ink/15 px-4 py-1.5 ${
                currentPage <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-ink/5"
              }`}
            >
              Previous
            </Link>
            <Link
              href={`/admin/orders${buildQuery({
                status,
                sort,
                page: Math.min(totalPages, currentPage + 1),
              })}`}
              aria-disabled={currentPage >= totalPages}
              className={`rounded-full border border-ink/15 px-4 py-1.5 ${
                currentPage >= totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-ink/5"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
