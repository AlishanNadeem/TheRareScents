import { telHref, whatsappHref } from "@/lib/phoneLinks";

export default function PhoneActions({
  phone,
  customerName = "",
  address = "",
}) {
  if (!phone) return <span className="text-neutral-400">—</span>;

  let message = customerName
    ? `Hi ${customerName}, this is The Rare Scents regarding your order.`
    : "Hi, this is The Rare Scents regarding your order.";

  // Keep WhatsApp short — full multi-line address stays in the admin panel.
  if (address?.trim()) {
    const oneLine = address.trim().replace(/\s+/g, " ");
    const snippet =
      oneLine.length > 80 ? `${oneLine.slice(0, 77)}…` : oneLine;
    message = `${message} Delivery: ${snippet}`;
  }

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
