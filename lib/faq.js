// Edit this array to add, remove, or change FAQ copy — layout stays the same.
export const FAQS = [
  {
    question: "Do you deliver across Pakistan?",
    answer:
      "Yes, we deliver nationwide including Karachi, Lahore, Islamabad, and other major cities.",
  },
  {
    question: "Is Cash on Delivery available?",
    answer: "Yes, Cash on Delivery is available across Pakistan.",
  },
  {
    question: "Are your perfumes 100% original?",
    answer:
      "Yes, all our fragrances are 100% authentic and sourced directly from trusted suppliers.",
  },
  {
    question: "How do I place an order?",
    answer:
      "You can order directly through our website or message us on WhatsApp with the product name.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically delivered within 2-5 business days depending on your city.",
  },
];

export function faqPageJsonLd(faqs = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
