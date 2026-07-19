import { Link } from "react-router-dom";
import { productPageFaqItems } from "../data/helpContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const productFaqTeaserItems = productPageFaqItems.slice(0, 5);

export function FaqSection() {
  return (
    <section className="section-block faq-help-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-image-header">
        <div className="faq-card__copy">
          <h2 className="faq-card__heading" id="faq-heading">
            Quick answers
          </h2>
          <p>The most common questions, answered.</p>
        </div>
        <div className="faq-card__actions faq-card__actions--desktop">
          <Link className="faq-card__primary-link" to="/help/contact">
            Contact Support
          </Link>
          <Link className="faq-card__secondary-link" to="/help/faq">
            View Full FAQ
          </Link>
        </div>
      </div>

      <div className="faq-help">
        <div className="faq-card">
          <Accordion className="faq-question-list" collapsible type="single">
            {productFaqTeaserItems.map((item) => (
              <AccordionItem className="faq-question-item" key={item.id} value={`product-faq-${item.id}`}>
                <AccordionTrigger className="faq-question-row [&>svg]:hidden">
                  <span>{item.question}</span>
                  <span aria-hidden className="faq-question-row__icon" />
                </AccordionTrigger>
                <AccordionContent className="faq-question-answer">
                  <p>{item.answer}</p>
                  <Link className="faq-question-answer__link" to={item.relatedLink.href}>
                    {item.relatedLink.label}
                  </Link>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="faq-card__actions faq-card__actions--mobile">
          <Link className="faq-card__all-guides-link" to="/help">
            View all FAQs &amp; guides <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
