"use client";

import { useId, useState } from "react";
import { submitOrder } from "@/lib/orders";
import { isValidPakistaniPhone } from "@/lib/validation";
import { formatPrice } from "@/lib/formatPrice";
import { siteConfig } from "@/lib/siteConfig";

const initialForm = {
  name: "",
  phone: "",
  city: "",
  quantity: 1,
  message: "",
  company: "", // honeypot — real users never see or fill this in
};

function inputClasses(hasError) {
  return `mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
      : "border-neutral-300 focus:border-gold focus:ring-gold"
  }`;
}

/**
 * Reusable order / inquiry form.
 * - Pass a `product` to render it as an "Order Form" tied to that fragrance.
 * - Omit `product` to use it as a general contact form (e.g. /contact).
 *
 * Submits to /api/orders (see lib/orders.js), which validates and saves the
 * order to MongoDB.
 */
export default function OrderForm({ product }) {
  const citiesListId = useId();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your full name.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else if (!isValidPakistaniPhone(form.phone)) {
      nextErrors.phone =
        "Enter a valid Pakistani mobile number, e.g. 03001234567.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitError("");
    setStatus("submitting");

    try {
      await submitOrder({
        product_id: product?._id ?? null,
        product_name: product?.name ?? "General Inquiry",
        product_slug: product?.slug ?? null,
        product_price: product?.price ?? null,
        name: form.name,
        phone: form.phone,
        city: form.city,
        quantity: form.quantity,
        message: form.message,
        // Spam honeypot: the backend silently rejects submissions where
        // this field is non-empty, since real users never fill it in.
        company: form.company,
      });

      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setErrors(error.fieldErrors || {});
      setSubmitError(
        error.message || "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-ink/10 bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-4 font-display text-lg text-ink">
          Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}!
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          We&apos;ll reach out on WhatsApp shortly to confirm your{" "}
          {product ? "order" : "request"}.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(initialForm);
            setStatus("idle");
          }}
          className="mt-6 text-sm font-medium text-ink underline underline-offset-2 hover:text-gold"
        >
          Submit another {product ? "order" : "message"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6">
      <h2 className="font-display text-lg text-ink">
        {product ? "Order Form" : "Send Us a Message"}
      </h2>

      {product && (
        <p className="mt-1 text-xs text-neutral-500">
          Ordering:{" "}
          <span className="font-medium text-neutral-700">{product.name}</span> —{" "}
          {formatPrice(product.price, product.currency)}
        </p>
      )}

      <p className="mt-1 text-xs text-neutral-500">
        {product
          ? "Prefer typing it out instead of WhatsApp? Fill this in and we'll confirm your order."
          : "Have a question or custom request? Send us your details and we'll get back to you."}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        {/* Honeypot field for spam protection. Hidden from sighted users and
            unreachable by keyboard, but present in the markup so bots that
            auto-fill every field will trip it — app/api/orders/route.js
            rejects any submission where this arrives non-empty. */}
        <div
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-neutral-800"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "order-name-error" : undefined}
            className={inputClasses(Boolean(errors.name))}
          />
          {errors.name && (
            <p
              id="order-name-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="text-sm font-medium text-neutral-800"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="03XXXXXXXXX"
            value={form.phone}
            onChange={handleChange}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "order-phone-error" : undefined}
            className={inputClasses(Boolean(errors.phone))}
          />
          {errors.phone && (
            <p
              id="order-phone-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="text-sm font-medium text-neutral-800"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            list={citiesListId}
            placeholder="e.g. Karachi"
            value={form.city}
            onChange={handleChange}
            className={inputClasses(false)}
          />
          <datalist id={citiesListId}>
            {siteConfig.cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-neutral-800"
          >
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            className={`${inputClasses(false)} w-24`}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-sm font-medium text-neutral-800"
          >
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={form.message}
            onChange={handleChange}
            className={inputClasses(false)}
          />
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting"
            ? "Sending..."
            : product
              ? "Submit Order"
              : "Send Message"}
        </button>
      </form>
    </div>
  );
}
