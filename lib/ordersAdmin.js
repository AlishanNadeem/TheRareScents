import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { ORDER_STATUSES, PAGE_SIZE } from "@/lib/orderConstants";

export function serializeOrder(doc) {
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    customer_name: doc.customer_name,
    phone: doc.phone,
    city: doc.city || "",
    quantity: doc.quantity,
    message: doc.message || "",
    status: doc.status,
    items: (doc.items || []).map((item) => ({
      product_id: item.product_id ? item.product_id.toString() : null,
      product_name: item.product_name || "",
      product_slug: item.product_slug || "",
      price: item.price || 0,
      quantity: item.quantity || 1,
    })),
    created_at: doc.created_at ? new Date(doc.created_at).toISOString() : null,
    updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : null,
  };
}

export function formatOrderDate(value) {
  return new Date(value).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderDateTime(value) {
  return new Date(value).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function itemsSummary(order) {
  if (!order.items?.length) {
    return "General Inquiry";
  }
  if (order.items.length === 1) {
    const item = order.items[0];
    return `${item.product_name}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`;
  }
  return `${order.items[0].product_name} +${order.items.length - 1} more`;
}

export async function getOrdersPage({
  status = "all",
  sort = "desc",
  page = 1,
} = {}) {
  await connectToDatabase();

  const filter = {};
  if (status && status !== "all" && ORDER_STATUSES.includes(status)) {
    filter.status = status;
  }

  const sortDir = sort === "asc" ? 1 : -1;
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const skip = (safePage - 1) * PAGE_SIZE;

  const [total, docs] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .sort({ created_at: sortDir })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    orders: docs.map(serializeOrder),
    total,
    page: safePage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}

export async function getOrderById(id) {
  if (!id || !/^[a-f0-9]{24}$/i.test(String(id))) {
    return null;
  }

  await connectToDatabase();
  const doc = await Order.findById(id).lean();
  return serializeOrder(doc);
}

export async function getDashboardOrderInsights() {
  await connectToDatabase();

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 29);

  const [
    statusBreakdown,
    topProducts,
    dailyOrders,
    recentOrders,
    totalOrders,
    newOrders,
    totalProducts,
  ] = await Promise.all([
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: {
            name: "$items.product_name",
            slug: "$items.product_slug",
          },
          units: { $sum: "$items.quantity" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { units: -1 } },
      { $limit: 5 },
    ]),
    Order.aggregate([
      { $match: { created_at: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.find().sort({ created_at: -1 }).limit(5).lean(),
    Order.countDocuments(),
    Order.countDocuments({ status: "NEW" }),
    Product.countDocuments(),
  ]);

  const ordersByStatus = ORDER_STATUSES.map((status) => ({
    status,
    count: statusBreakdown.find((row) => row._id === status)?.count || 0,
  }));

  const dailyMap = new Map(dailyOrders.map((row) => [row._id, row.count]));
  const ordersLast30Days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    ordersLast30Days.push({
      date: key,
      label: day.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
      }),
      count: dailyMap.get(key) || 0,
    });
  }

  return {
    totalProducts,
    totalOrders,
    newOrders,
    ordersByStatus,
    topProducts: topProducts.map((row) => ({
      name: row._id.name || "Unknown",
      slug: row._id.slug || "",
      units: row.units,
      orders: row.orders,
    })),
    ordersLast30Days,
    recentOrders: recentOrders.map(serializeOrder),
  };
}
