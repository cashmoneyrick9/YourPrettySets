import { Link } from "react-router-dom";
import { productPageFaqItems } from "../data/helpContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function FaqSection() {
  return (
    <section className="section-block faq-help-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-image-header">
        <div className="faq-card__copy">
          <h2 className="faq-card__heading" id="faq-heading">
            Questions before you order
          </h2>
          <p>Answers on sizing, wear estimates, application, and ordering.</p>
        </div>
        <div className="faq-card__actions">
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
            {productPageFaqItems.map((item) => (
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
      </div>
    </section>
  );
}
