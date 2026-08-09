// Submits an order/inquiry to the real backend (app/api/orders/route.js),
// which validates it server-side and saves it to MongoDB. OrderForm doesn't
// need to change when the backend changes — only this function does.
export async function submitOrder(order) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    const error = new Error(
      data.error || "Something went wrong. Please try again."
    );
    error.fieldErrors = data.errors;
    throw error;
  }

  return data;
}
