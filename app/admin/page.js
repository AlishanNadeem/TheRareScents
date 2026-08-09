import Link from "next/link";
import OrdersChart from "@/components/admin/OrdersChart";
import PhoneActions from "@/components/admin/PhoneActions";
import { ORDER_STATUS_LABELS } from "@/lib/orderConstants";
import {
  formatOrderDate,
  getDashboardOrderInsights,
  itemsSummary,
} from "@/lib/ordersAdmin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const {
    totalProducts,
    totalOrders,
    newOrders,
    ordersByStatus,
    topProducts,
    ordersLast30Days,
    recentOrders,
  } = await getDashboardOrderInsights();

  const cards = [
    { label: "Total Products", value: totalProducts },
    { label: "Total Orders", value: totalOrders },
    { label: "New Orders", value: newOrders },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-ink/10 bg-white p-6"
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg text-ink">Orders by Status</h2>
          <ul className="mt-4 space-y-3">
            {ordersByStatus.map((row) => (
              <li
                key={row.status}
                className="flex items-center justify-between text-sm"
              >
                <Link
                  href={`/admin/orders?status=${row.status}`}
                  className="text-neutral-700 hover:text-ink hover:underline"
                >
                  {ORDER_STATUS_LABELS[row.status]}
                </Link>
                <span className="font-semibold text-ink">{row.count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-ink/10 bg-white p-6 lg:col-span-2">
          <h2 className="font-display text-lg text-ink">
            Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              No product orders yet.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {topProducts.map((product, index) => (
                <li
                  key={`${product.slug || product.name}-${index}`}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-xs font-semibold text-gold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-neutral-500">
                        {product.orders} order
                        {product.orders === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-ink">
                    {product.units} units
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-ink/10 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-ink">
            Orders — Last 30 Days
          </h2>
          <p className="text-sm text-neutral-500">
            {ordersLast30Days.reduce((sum, row) => sum + row.count, 0)} total
          </p>
        </div>
        <OrdersChart data={ordersLast30Days} />
      </section>

      <section className="mt-8 rounded-xl border border-ink/10 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-ink">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-ink underline-offset-2 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-neutral-500">
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2"> </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-ink/5">
                    <td className="py-2 pr-4 font-medium text-ink">
                      {order.customer_name}
                    </td>
                    <td className="py-2 pr-4">
                      <PhoneActions
                        phone={order.phone}
                        customerName={order.customer_name}
                      />
                    </td>
                    <td className="py-2 pr-4 text-neutral-600">
                      {itemsSummary(order)}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-neutral-500">
                      {formatOrderDate(order.created_at)}
                    </td>
                    <td className="py-2 text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-xs font-medium text-ink underline-offset-2 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
