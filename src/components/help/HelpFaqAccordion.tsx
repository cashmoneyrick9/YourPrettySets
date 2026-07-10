import { Link } from "react-router-dom";
import type { HelpFaqItem } from "@/data/helpContent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type HelpFaqAccordionProps = {
  items: readonly HelpFaqItem[];
};

export function HelpFaqAccordion({ items }: HelpFaqAccordionProps) {
  return (
    <Accordion className="help-faq-accordion" collapsible type="single">
      {items.map((item) => (
        <AccordionItem className="help-faq-accordion__item" key={item.id} value={item.id}>
          <AccordionTrigger className="help-faq-accordion__trigger [&>svg]:hidden">
            <span>{item.question}</span>
            <span aria-hidden="true" className="help-faq-accordion__icon" />
          </AccordionTrigger>
          <AccordionContent className="help-faq-accordion__content">
            <p>{item.answer}</p>
            <Link className="help-faq-accordion__link" to={item.relatedLink.href}>
              {item.relatedLink.label} <span aria-hidden="true">→</span>
            </Link>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
