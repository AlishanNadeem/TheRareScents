"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderConstants";

export default function OrderStatusSelect({ orderId, value, size = "sm" }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event) {
    const next = event.target.value;
    const previous = status;
    setStatus(next);
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setStatus(previous);
        setError(data.error || "Could not update status.");
      } else {
        router.refresh();
      }
    } catch {
      setStatus(previous);
      setError("Could not update status.");
    } finally {
      setSaving(false);
    }
  }

  const selectClass =
    size === "md"
      ? "rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-60"
      : "rounded-full border border-ink/15 bg-white px-2 py-1 text-xs text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-60";

  return (
    <div>
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        aria-label="Order status"
        className={selectClass}
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option}>
            {ORDER_STATUS_LABELS[option]}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
