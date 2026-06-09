import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const homepageFaqItems = [
  {
    question: "How do I know my size?",
    answer:
      "Use a sizing kit for the safest fit, or measure the widest part of each natural nail in millimeters and match each finger to the closest size."
  },
  {
    question: "How long do press-ons last?",
    answer:
      "Wear time depends on prep and adhesive. Glue is best for longer wear, while tabs are better for shorter wear."
  },
  {
    question: "Can I reuse them?",
    answer: "Yes. Many sets can be reused if they are removed gently, cleaned, and stored properly."
  },
  {
    question: "Should I use glue or tabs?",
    answer: "Choose glue when you want a stronger hold. Choose tabs when you want easier removal or short-term wear."
  },
  {
    question: "How long does my order take?",
    answer:
      "Ready-to-wear processing time should follow the timing shown at checkout or on the product page. Shipping time starts after processing."
  },
  {
    question: "Do you take custom orders?",
    answer:
      "Custom availability depends on the current queue. Customers should contact support or check the custom-order flow when available."
  },
  {
    question: "What if my set does not fit?",
    answer:
      "Contact support as soon as possible. A sizing kit before ordering is the best way to avoid fit issues."
  }
] as const;

export function FaqSection() {
  return (
    <section className="section-block faq-help-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-help">
        <div className="faq-card">
          <div className="faq-card__header faq-card__header--image">
            <div className="faq-card__copy">
              <h2 className="faq-card__heading" id="faq-heading">
                Questions before you order
              </h2>
              <p>Answers on sizing, wear time, application, and custom orders.</p>
            </div>
            <div className="faq-card__actions">
              <a className="faq-card__primary-link" href="mailto:hello@yourprettysets.com">
                Contact Support
              </a>
              {/* TODO: Replace this safe in-page placeholder with the full FAQ route when that page exists. */}
              <a className="faq-card__secondary-link" href="#faq">
                View Full FAQ
              </a>
            </div>
          </div>

          <Accordion className="faq-question-list" collapsible type="single">
            {homepageFaqItems.map((item, index) => (
              <AccordionItem className="faq-question-item" key={item.question} value={`homepage-faq-${index}`}>
                <AccordionTrigger className="faq-question-row [&>svg]:hidden">
                  <span>{item.question}</span>
                  <span aria-hidden className="faq-question-row__icon" />
                </AccordionTrigger>
                <AccordionContent className="faq-question-answer">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
