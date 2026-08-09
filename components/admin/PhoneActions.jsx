import { telHref, whatsappHref } from "@/lib/phoneLinks";

export default function PhoneActions({ phone, customerName = "" }) {
  if (!phone) return <span className="text-neutral-400">—</span>;

  const message = customerName
    ? `Hi ${customerName}, this is The Rare Scents regarding your order.`
    : "Hi, this is The Rare Scents regarding your order.";

  return (
    <div className="flex flex-col gap-1">
      <span className="text-neutral-700">{phone}</span>
      <div className="flex flex-wrap gap-2 text-xs">
        <a
          href={telHref(phone)}
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          Call
        </a>
        <a
          href={whatsappHref(phone, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
